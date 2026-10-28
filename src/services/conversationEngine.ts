import { ExtractedEntities, ResponseClassification } from '../types/chatbot';
import { DEMO_ORDERS } from '../data/scenarios';

export interface EvaluationResult {
  intentId: string;
  intentName: string;
  confidence: number;
  extractedEntities: ExtractedEntities;
  missingRequiredEntities: string[];
  classification: ResponseClassification;
  assistantMessage: string;
  suggestedReplies: string[];
  selectedRule: string;
  decisionExplanation: string;
  strategicObjective: string;
  expectedNextStep: string;
  isEscalated: boolean;
  escalationDetails?: {
    reason: string;
    tier: string;
    contextSummary: string;
  };
}

export function extractEntities(text: string): ExtractedEntities {
  const entities: ExtractedEntities = {};
  const upper = text.toUpperCase();

  // Order ID pattern e.g. DEMO-1042, DEMO-8080, DEMO-9999, or generic DEMO-\d{4}
  const orderMatch = text.match(/\b(DEMO[-_ ]?\d{4})\b/i);
  if (orderMatch) {
    entities.orderId = orderMatch[1].toUpperCase().replace(/[_ ]/, '-');
  }

  if (/damage|broken|scratched|defective/i.test(text)) {
    entities.refundReason = 'Damaged goods upon receipt';
  } else if (/late|delay|too slow/i.test(text)) {
    entities.refundReason = 'Delivery delay';
  } else if (/wrong item|wrong size|different/i.test(text)) {
    entities.refundReason = 'Wrong item sent';
  }

  if (/frustrat|angry|ridiculous|terrible|hurry|now!|give me my money/i.test(text)) {
    entities.customerSentiment = 'frustrated';
  }

  return entities;
}

export function evaluateUserInput(
  userText: string,
  currentState: {
    currentScenarioId: string;
    currentIntentId: string;
    extractedEntities: ExtractedEntities;
    clarificationCount: number;
    isEscalated: boolean;
  }
): EvaluationResult {
  const cleanText = userText.trim();
  const lower = cleanText.toLowerCase();
  const newEntities = extractEntities(cleanText);
  const mergedEntities: ExtractedEntities = {
    ...currentState.extractedEntities,
    ...newEntities
  };

  // 1. Check Security / Financial Guardrail
  if (
    /bank|password|wire money|transfer money|credit card|ssn|social security/i.test(lower)
  ) {
    return {
      intentId: 'unsupported_security_action',
      intentName: 'Unsupported Security & Banking Guardrail',
      confidence: 0.99,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'policy_boundary',
      assistantMessage:
        '🔒 **Security Notice:** For your security, this conversational assistant cannot view, modify, or process banking passwords, credit cards, or wire transfers.\n\nPlease visit our authenticated [Security Settings Portal](#) directly. Never share confidential credentials in chat.',
      suggestedReplies: ['Return to main menu', 'Track an order instead', 'Contact security desk'],
      selectedRule: 'BR-05: Security & PII Airgap Guardrail',
      decisionExplanation:
        'User requested high-risk financial or credential operations. The policy engine strictly blocks execution within automated chat to prevent credential leakage.',
      strategicObjective:
        'Enforce PCI-DSS, SOC2, and data privacy safeguards by directing users to authenticated self-service security channels.',
      expectedNextStep: 'Acknowledge security boundary or redirect to standard support topics.',
      isEscalated: false
    };
  }

  // 2. Check Explicit Human Escalation
  if (
    /human|agent|real person|representative|operator|talk to someone|speak with a person/i.test(lower)
  ) {
    const summary = `Customer requested live support. Existing order: ${mergedEntities.orderId || 'None provided'}. Prior Intent: ${currentState.currentIntentId}. Sentiment: ${mergedEntities.customerSentiment || 'Neutral'}.`;
    return {
      intentId: 'human_escalation',
      intentName: 'Live Human Agent Transfer',
      confidence: 0.98,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'escalation',
      assistantMessage:
        '🤝 **Simulated Human Handoff Initiated**\n\nI am packaging your conversation context for our Tier-2 customer advocacy team. In a live environment, this transfers you without repeating yourself:\n\n• **Queue Priority:** Standard Support\n• **Estimated Wait:** ~2 minutes\n• **Handoff Packet:** Context & transcript attached.',
      suggestedReplies: ['Wait in queue (simulated)', 'Cancel handoff', 'I have my order ID now'],
      selectedRule: 'BR-03: Frustration & Escalation Protocol',
      decisionExplanation:
        'Direct customer request for human intervention. The assistant honors this immediately without excessive deflection attempts.',
      strategicObjective:
        'Reduce customer friction and preserve brand NPS by providing an effortless transition to human care with pre-compiled context.',
      expectedNextStep: 'Simulate live agent connection or display simulated ticket summary.',
      isEscalated: true,
      escalationDetails: {
        reason: 'Customer explicit escalation request',
        tier: 'Tier-2 Customer Care',
        contextSummary: summary
      }
    };
  }

  // 3. Out-of-Scope Detection
  if (
    /weather|rain|temperature|football|world cup|joke|recipe|poem|capital of|movie|write code|python/i.test(lower)
  ) {
    return {
      intentId: 'out_of_scope_query',
      intentName: 'Out of Scope / Domain Boundary',
      confidence: 0.95,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'out_of_scope',
      assistantMessage:
        'I am designed specifically for shopping and order support, so I cannot answer general knowledge or weather inquiries! ⛅\n\nHowever, I can happily help you check order delivery, initiate a refund, or update shipping details. Which would you like to do?',
      suggestedReplies: ['Track my order', 'I need a refund', 'Update delivery address'],
      selectedRule: 'BR-04: Domain Scope Boundary Enforcement',
      decisionExplanation:
        'Input recognized as clearly outside ecommerce enterprise domain. Assistant politely declines and offers in-scope suggestions.',
      strategicObjective:
        'Prevent hallucination, maintain enterprise brand trust, and guide visitors to core value tasks without dead-end drops.',
      expectedNextStep: 'User selects an in-scope retail action chip.',
      isEscalated: false
    };
  }

  // 4. Ambiguous / Low Context
  if (
    /that thing|help with that|what happened|it does not work|problem|confused|hello|hi\b|hey\b/i.test(lower) &&
    !/order|refund|track|return|address/i.test(lower)
  ) {
    const isRepeat = currentState.clarificationCount >= 1;
    if (isRepeat) {
      return {
        intentId: 'ambiguous_query',
        intentName: 'Ambiguous Query (Repeated Clarification)',
        confidence: 0.45,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['intentCategory'],
        classification: 'escalation',
        assistantMessage:
          'I want to make sure you get the right help without wasting time. Since I am still unclear on what you need, would you like me to connect you with a live agent, or select from the options below?',
        suggestedReplies: ['Connect to human agent', 'Track order DEMO-1042', 'Start a refund'],
        selectedRule: 'BR-03: Turn-Loop Breaker & Frustration Escalation',
        decisionExplanation:
          'Ambiguous query repeated for a 2nd turn. System stops circular clarifying prompts and proactively presents human handoff.',
        strategicObjective:
          'Avoid chatbot loop fatigue; escalate gracefully when ambiguity persists beyond 1 retry.',
        expectedNextStep: 'User chooses human handoff or explicitly picks a standard workflow.',
        isEscalated: true,
        escalationDetails: {
          reason: 'Ambiguity loop breaker triggered after 2 turns',
          tier: 'Tier-1 General Triage',
          contextSummary: 'User submitted ambiguous phrases without clarifying domain category.'
        }
      };
    }

    return {
      intentId: 'ambiguous_query',
      intentName: 'Ambiguous Query Disambiguation',
      confidence: 0.52,
      extractedEntities: mergedEntities,
      missingRequiredEntities: ['intentCategory'],
      classification: 'clarification',
      assistantMessage:
        'I want to make sure I get you to the exact right team or answer. Could you clarify which of these you need assistance with today?',
      suggestedReplies: ['Track recent order', 'Return an item / Refund', 'Address or shipping question'],
      selectedRule: 'BR-01: Disambiguation Menu Strategy',
      decisionExplanation:
        'Confidence score is below the 0.65 automation threshold. Assistant displays high-probability intent chips instead of guessing.',
      strategicObjective:
        'Ensure precision in intent classification by empowering users with single-click disambiguation chips.',
      expectedNextStep: 'User clicks a high-level intent chip or types specific intent details.',
      isEscalated: false
    };
  }

  // 5. Address Modification (Topic Switching / Complex)
  if (/address|shipping location|postal code|deliver to my|zip code/i.test(lower)) {
    const hasOrder = Boolean(mergedEntities.orderId);
    if (!hasOrder) {
      return {
        intentId: 'address_change',
        intentName: 'Delivery Address Modification',
        confidence: 0.91,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'clarification',
        assistantMessage:
          'I can certainly help you update your delivery address! Could you please provide your order ID? (For example: **DEMO-1042**)',
        suggestedReplies: ['DEMO-1042', 'DEMO-8080', 'Cancel order instead'],
        selectedRule: 'BR-01: Mandatory Slot Verification',
        decisionExplanation:
          'Recognized address change intent. Slot filling requires orderId to query carrier intercept cutoff rules.',
        strategicObjective:
          'Safely gather order credentials before authorizing modification to carrier shipping labels.',
        expectedNextStep: 'User provides order ID to verify dispatch status.',
        isEscalated: false
      };
    }

    const orderInfo = DEMO_ORDERS[mergedEntities.orderId!];
    if (orderInfo && orderInfo.status.includes('Out for Delivery')) {
      return {
        intentId: 'address_change',
        intentName: 'Delivery Address Modification',
        confidence: 0.94,
        extractedEntities: mergedEntities,
        missingRequiredEntities: [],
        classification: 'policy_boundary',
        assistantMessage:
          `📦 Order **${mergedEntities.orderId}** is already **Out for Delivery** with ${orderInfo.carrier}.\n\nBecause the parcel is currently on the delivery truck, direct in-flight address updates cannot be processed automatically. Would you like me to connect you with courier dispatch or hold the parcel at an access point?`,
        suggestedReplies: ['Hold parcel at local pickup point', 'Connect to live logistics specialist', 'Keep delivery as is'],
        selectedRule: 'BR-04: Carrier Intercept Window Policy',
        decisionExplanation:
          'Order is already in final delivery transit. Automatic address update is locked out to prevent lost merchandise in carrier streams.',
        strategicObjective:
          'Prevent misdelivered packages and set accurate customer expectations regarding carrier dispatch locks.',
        expectedNextStep: 'User selects carrier pickup hold or logistics agent handoff.',
        isEscalated: false
      };
    }

    return {
      intentId: 'address_change',
      intentName: 'Delivery Address Modification',
      confidence: 0.93,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'direct_answer',
      assistantMessage:
        `✅ Good news! Order **${mergedEntities.orderId}** is currently processing and eligible for a destination address update.\n\nPlease type your updated street address, city, and zip code to save the change.`,
      suggestedReplies: ['123 Innovation Way, Suite 400', 'Use my default home address', 'Cancel address update'],
      selectedRule: 'BR-04: Address Update Execution',
      decisionExplanation:
        'Order is within early fulfillment stage where carrier labels are still mutable.',
      strategicObjective:
        'Provide seamless self-service address modification, cutting down carrier return-to-sender expenses.',
      expectedNextStep: 'User inputs new address string.',
      isEscalated: false
    };
  }

  // 6. Refund Request / Repeated Unresolved
  if (/refund|return|money back|give me my money/i.test(lower)) {
    // Check if repeated frustration
    if (mergedEntities.customerSentiment === 'frustrated' && !mergedEntities.orderId) {
      return {
        intentId: 'refund_request',
        intentName: 'Refund Request (Frustration Loop Breaker)',
        confidence: 0.93,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'escalation',
        assistantMessage:
          'I hear your urgency and want to make sure your refund is treated promptly. Since we need your order details to process the return, would you prefer to enter **DEMO-1042**, or would you like me to hand this ticket to our billing manager right now?',
        suggestedReplies: ['Use DEMO-1042', 'DEMO-9999 (Over 45 days)', 'Transfer to billing manager'],
        selectedRule: 'BR-03: Turn-Loop Breaker & Frustration Escalation',
        decisionExplanation:
          'High negative sentiment and repeated refund demand detected without required order identification.',
        strategicObjective:
          'De-escalate emotional friction immediately by offering proactive human handoff alongside clear sample IDs.',
        expectedNextStep: 'Customer inputs valid order identifier or requests billing manager.',
        isEscalated: true,
        escalationDetails: {
          reason: 'Customer frustration detected during refund slot filling',
          tier: 'Tier-2 Billing Manager',
          contextSummary: 'Repeated refund demand with missing order parameter.'
        }
      };
    }

    const hasOrder = Boolean(mergedEntities.orderId);
    if (!hasOrder) {
      return {
        intentId: 'refund_request',
        intentName: 'Refund & Returns Qualification',
        confidence: 0.92,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'clarification',
        assistantMessage:
          'I would be happy to help process your refund or return. To check your 30-day eligibility and print a prepaid label, what is your order ID? (e.g. **DEMO-1042** or **DEMO-8080**)',
        suggestedReplies: ['DEMO-1042 (Eligible)', 'DEMO-9999 (Past window)', 'I do not have my order number'],
        selectedRule: 'BR-01: Mandatory Slot Verification',
        decisionExplanation:
          'Refund intent detected, but return policy checks require an orderId to check delivery timestamps and item categories.',
        strategicObjective:
          'Automate policy verification while shielding agents from manual timestamp lookups.',
        expectedNextStep: 'Customer provides order ID for eligibility validation.',
        isEscalated: false
      };
    }

    const orderData = DEMO_ORDERS[mergedEntities.orderId!];
    if (!orderData) {
      return {
        intentId: 'refund_request',
        intentName: 'Refund Qualification (Unknown ID)',
        confidence: 0.88,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'fallback',
        assistantMessage:
          `I couldn't locate order **${mergedEntities.orderId}** in our simulated demo database. Try testing with one of our demo records:\n\n• **DEMO-1042** (Within 30-day return window)\n• **DEMO-9999** (Past 30-day window to test policy guardrail)`,
        suggestedReplies: ['DEMO-1042', 'DEMO-9999', 'Speak to human agent'],
        selectedRule: 'BR-02: Zero Hallucination Fulfillment',
        decisionExplanation:
          'Provided order ID does not exist in store records. Bot declines to guess and suggests valid demo IDs.',
        strategicObjective:
          'Uphold data integrity and guide evaluators smoothly through the interactive demo.',
        expectedNextStep: 'User provides a known demo identifier.',
        isEscalated: false
      };
    }

    if (!orderData.eligibleForRefund) {
      return {
        intentId: 'refund_request',
        intentName: 'Refund Policy Expiry Guardrail',
        confidence: 0.96,
        extractedEntities: mergedEntities,
        missingRequiredEntities: [],
        classification: 'policy_boundary',
        assistantMessage:
          `⚠️ Order **${orderData.id}** was delivered on ${orderData.expectedDelivery}, which is past our standard **30-day return window**.\n\nAutomated return labels cannot be generated for this order. However, if this was due to warranty failure or shipping damage, I can submit an exception review for our team.`,
        suggestedReplies: ['Request warranty exception', 'Talk to human agent', 'Check a different order'],
        selectedRule: 'BR-02: Return Policy Enforcement',
        decisionExplanation:
          'Demonstrates enterprise policy boundary when an order fails the 30-day delivery cutoff.',
        strategicObjective:
          'Protect business margins by enforcing policy rules deterministically while retaining an escalation escape hatch.',
        expectedNextStep: 'User requests warranty exception or human agent review.',
        isEscalated: false
      };
    }

    return {
      intentId: 'refund_request',
      intentName: 'Refund Qualification (Eligible)',
      confidence: 0.95,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'direct_answer',
      assistantMessage:
        `🎉 Great news! Order **${orderData.id}** (${orderData.items.join(', ')}) is fully eligible for a return under our 30-day guarantee.\n\nHow would you like to receive your resolution?\n• **Instant Store Credit (+10% Bonus)**\n• **Original Payment Method Refund** (3-5 business days)`,
      suggestedReplies: ['Instant Store Credit (+10%)', 'Original Payment Method', 'Cancel refund request'],
      selectedRule: 'BR-01: Refund Eligibility Resolution',
      decisionExplanation:
        'Order validated against delivery date, items verified, and customer presented with retention-optimized resolution choices.',
      strategicObjective:
        'Drive customer retention and LTV by incentivizing store credit bonuses over cash outflows.',
      expectedNextStep: 'Customer selects preferred payout mechanism to trigger label generation.',
      isEscalated: false
    };
  }

  // 7. Order Tracking / WISMO
  if (/order|track|where is my|shipping|package|delivery|parcel|status/i.test(lower) || mergedEntities.orderId) {
    const hasOrder = Boolean(mergedEntities.orderId);
    if (!hasOrder) {
      return {
        intentId: 'order_tracking',
        intentName: 'Order Tracking & Status',
        confidence: 0.94,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'clarification',
        assistantMessage:
          'I can check your live tracking immediately! 🚚\n\nWhat is your order number? In this interactive demo, you can type or click **DEMO-1042** or **DEMO-8080**.',
        suggestedReplies: ['DEMO-1042', 'DEMO-8080', 'I forgot my order ID'],
        selectedRule: 'BR-01: Mandatory Slot Verification',
        decisionExplanation:
          'Intent clearly classified as order_tracking. The required slot "orderId" is missing, so slot filling prompt is fired.',
        strategicObjective:
          'Collect necessary primary key before attempting fulfillment database query.',
        expectedNextStep: 'User provides an order ID.',
        isEscalated: false
      };
    }

    const orderData = DEMO_ORDERS[mergedEntities.orderId!];
    if (!orderData) {
      return {
        intentId: 'order_tracking',
        intentName: 'Order Tracking (Unknown ID)',
        confidence: 0.89,
        extractedEntities: mergedEntities,
        missingRequiredEntities: ['orderId'],
        classification: 'fallback',
        assistantMessage:
          `I searched our simulated records but could not find order **${mergedEntities.orderId}**.\n\nPlease verify your order number. You can try:\n• **DEMO-1042** (Out for Delivery today)\n• **DEMO-8080** (Delivered recent parcel)`,
        suggestedReplies: ['DEMO-1042', 'DEMO-8080', 'Speak to human agent'],
        selectedRule: 'BR-02: Zero Hallucination Fulfillment',
        decisionExplanation:
          'Provided identifier did not match simulated database. Fallback triggered to prevent hallucinated tracking milestones.',
        strategicObjective:
          'Maintain complete transparency and provide guided recovery paths when data lookup yields 0 records.',
        expectedNextStep: 'User supplies a valid demo identifier.',
        isEscalated: false
      };
    }

    return {
      intentId: 'order_tracking',
      intentName: 'Order Tracking (Resolved)',
      confidence: 0.97,
      extractedEntities: mergedEntities,
      missingRequiredEntities: [],
      classification: 'direct_answer',
      assistantMessage:
        `📦 **Order Status for ${orderData.id}:**\n\n• **Status:** ${orderData.status}\n• **Estimated Arrival:** ${orderData.expectedDelivery}\n• **Carrier:** ${orderData.carrier}\n• **Destination:** ${orderData.destination}\n• **Items:** ${orderData.items.join(', ')}\n\nWould you like SMS delivery alerts, or do you need help with something else?`,
      suggestedReplies: ['Request a refund instead', 'Change delivery address', 'All set, thank you!'],
      selectedRule: 'BR-01: Fulfillment Card Rendering',
      decisionExplanation:
        'All required slots satisfied. Real-time fulfillment summary card rendered with contextual follow-up chips.',
      strategicObjective:
        'Deflect WISMO contacts via high-velocity self-service, reducing operational cost per contact to near-zero.',
      expectedNextStep: 'User confirms receipt of information or switches topic.',
      isEscalated: false
    };
  }

  // 8. Generic / Unknown Fallback
  return {
    intentId: 'unknown_intent',
    intentName: 'Unknown / Unrecognized Query',
    confidence: 0.38,
    extractedEntities: mergedEntities,
    missingRequiredEntities: [],
    classification: 'fallback',
    assistantMessage:
      'I am not quite sure how to help with that specific phrase yet. As a simulated ecommerce assistant, I specialize in:\n\n1. **Order Tracking** (e.g. "Where is DEMO-1042?")\n2. **Refunds & Returns** (e.g. "I want a refund")\n3. **Address Updates** (e.g. "Change delivery address")\n\nPlease select one or try rephrasing!',
    suggestedReplies: ['Where is DEMO-1042?', 'I want a refund', 'I want to speak to a person'],
    selectedRule: 'BR-03: Graceful Fallback with Topic Recovery',
    decisionExplanation:
      'Utterance did not meet confidence threshold for any known intent. Fallback recovery menu presented.',
    strategicObjective:
      'Turn unrecognized user expressions into productive interactions through guided sample prompts.',
    expectedNextStep: 'User selects a guided prompt pill.',
    isEscalated: false
  };
}
