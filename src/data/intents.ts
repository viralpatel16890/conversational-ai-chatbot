import { IntentDefinition, BusinessRule } from '../types/chatbot';

export const INTENTS_CATALOG: IntentDefinition[] = [
  {
    id: 'order_tracking',
    name: 'Order Tracking & Status',
    businessObjective: 'Deflect high-volume "Where is my order" (WISMO) tickets by delivering immediate, accurate shipping checkpoints without agent contact.',
    examplePhrases: [
      'Where is my order?',
      'Track my package',
      'When will DEMO-1042 arrive?',
      'Has my shipment left the fulfillment hub?'
    ],
    requiredEntities: ['orderId'],
    optionalEntities: ['emailAddress', 'carrierPreference'],
    preconditions: ['User must have placed an order within the last 90 days.'],
    responseStrategy: 'Check if orderId entity is extracted from prompt. If missing, trigger slot-filling prompt with sample format. Once present, render real-time tracking card and expected delivery window.',
    fallbackBehavior: 'If orderId is invalid or not found after 2 attempts, offer lookup via registered email or direct human handoff.',
    successCriteria: 'User receives fulfillment status in under 2 turns without requiring live agent intervention.',
    escalationConditions: [
      'Package marked as delivered but reported missing.',
      'Carrier tracking shows exception delay over 5 business days.'
    ],
    sampleResponses: [
      'I can look that up right away! What is your order number? (e.g., DEMO-1042)',
      'Order DEMO-1042 is currently Out for Delivery with FastTrack Express! Estimated arrival: Today by 5:30 PM.'
    ]
  },
  {
    id: 'refund_request',
    name: 'Refund & Returns Processing',
    businessObjective: 'Automate initial return qualification against store return policies, reducing customer effort while preventing ineligible claims.',
    examplePhrases: [
      'I want a refund for my order',
      'Can I return this item?',
      'My package arrived damaged, give me a refund',
      'I need money back on DEMO-1042'
    ],
    requiredEntities: ['orderId'],
    optionalEntities: ['refundReason', 'conditionDescription'],
    preconditions: ['Order must have been delivered within 30 days.'],
    responseStrategy: 'Collect order ID, check delivery date eligibility, query condition or reason, and generate a pre-paid digital return label or policy notice.',
    fallbackBehavior: 'If order is outside 30-day window or high-value exception, provide transparent explanation and transfer to dispute management.',
    successCriteria: 'Customer understands eligibility status and receives return label or escalation path in <= 3 turns.',
    escalationConditions: [
      'Item arrived damaged or missing pieces.',
      'Customer disputes standard restocking policy after 2 turns.'
    ],
    sampleResponses: [
      'I can guide you through our hassle-free returns. Could you share your order number (e.g. DEMO-1042)?',
      'Thank you! Order DEMO-1042 was delivered within our 30-day window. Would you prefer a prepaid return shipping label or store credit with a 10% bonus?'
    ]
  },
  {
    id: 'out_of_scope_query',
    name: 'Out of Scope / Domain Boundary',
    businessObjective: 'Prevent hallucination, maintain brand credibility, and steer conversational users back to supported ecommerce domains without friction.',
    examplePhrases: [
      'What is the weather like today?',
      'Who won the World Cup in 1994?',
      'Write me a python script for sorting lists',
      'Tell me a bedtime story'
    ],
    requiredEntities: [],
    optionalEntities: [],
    preconditions: ['User message has high out-of-domain classifier score.'],
    responseStrategy: 'Politely acknowledge inability to assist with non-retail questions, restate primary enterprise capabilities (Orders, Returns, Product support), and offer one-click prompt pills.',
    fallbackBehavior: 'If repeated, remind user of assistant scope and offer option to connect with customer care.',
    successCriteria: 'User acknowledges boundary and selects a valid supported topic in subsequent turn.',
    escalationConditions: ['User insists on non-retail advice affecting medical/legal situations.'],
    sampleResponses: [
      'I am an automated shopping and order support assistant, so I cannot look up external topics like the weather. However, I can help you track an order, start a return, or update your delivery address!'
    ]
  },
  {
    id: 'ambiguous_query',
    name: 'Ambiguous / Low Confidence Query',
    businessObjective: 'Eliminate false positives and misguided automated actions by gracefully requesting clarification when intent confidence is below 0.65.',
    examplePhrases: [
      'I need help with that thing',
      'It does not work',
      'Please check this',
      'What happened?'
    ],
    requiredEntities: [],
    optionalEntities: [],
    preconditions: ['Top intent probability score is below configured threshold (0.65).'],
    responseStrategy: 'Acknowledge ambiguity without robotic jargon. Present 3 highest-probability quick-reply chips to let the user disambiguate with a single tap.',
    fallbackBehavior: 'If second turn remains ambiguous, route to human triage.',
    successCriteria: 'Disambiguation resolved in single turn.',
    escalationConditions: ['Two consecutive ambiguous inputs without user clarification.'],
    sampleResponses: [
      'I want to make sure I get you the right assistance. Could you tell me a bit more, or select one of these common topics?'
    ]
  },
  {
    id: 'human_escalation',
    name: 'Live Human Agent Transfer',
    businessObjective: 'Provide a smooth, frustration-free bridge between self-service and human agents with complete contextual summary packets.',
    examplePhrases: [
      'I want to speak with a real person',
      'Connect me to an agent',
      'Customer service representative please',
      'Human operator'
    ],
    requiredEntities: [],
    optionalEntities: ['escalationUrgency', 'preferredChannel'],
    preconditions: ['User explicit request or repeated failure trigger.'],
    responseStrategy: 'Immediately honor request without defensive deflections. Generate structured transfer summary showing current intent, conversation history, and customer sentiment.',
    fallbackBehavior: 'Provide business operating hours and callback scheduling if queue is unavailable.',
    successCriteria: 'User context transferred seamlessly without requiring repetitive explanations to live staff.',
    escalationConditions: ['Always escalates.'],
    sampleResponses: [
      'I understand completely! In this demo, I will simulate generating a live support handoff ticket with your conversation transcript and intent summary.'
    ]
  },
  {
    id: 'address_change',
    name: 'Delivery Address Modification',
    businessObjective: 'Enable self-service logistics changes prior to shipping cutoff while protecting customer privacy and shipping validity.',
    examplePhrases: [
      'Can I change my shipping address?',
      'I typed the wrong postal code',
      'Update my delivery address for DEMO-1042',
      'Ship to my office instead'
    ],
    requiredEntities: ['orderId'],
    optionalEntities: ['newAddress', 'postalCode'],
    preconditions: ['Order status must be "Processing" or "Pending Shipment".'],
    responseStrategy: 'Verify order dispatch status. If package is already Out for Delivery, explain carrier re-routing limitations and provide carrier intercept instructions.',
    fallbackBehavior: 'Escalate to logistics team if dispatch cutoff is within 30 minutes.',
    successCriteria: 'Customer understands modification window constraints and receives action plan.',
    escalationConditions: ['Package has already been marked delivered to wrong address.'],
    sampleResponses: [
      'I can check if your package is still eligible for an address update! Which order are you updating? (e.g., DEMO-1042)'
    ]
  },
  {
    id: 'unsupported_security_action',
    name: 'Unsupported Financial & Credential Action',
    businessObjective: 'Strict compliance with banking and PCI-DSS/GDPR security rules preventing conversational AI from processing direct credentials or unverified financial transfers.',
    examplePhrases: [
      'Change my bank account password and transfer money',
      'Here is my credit card number: 4111...',
      'Can you wire funds from my checking account?',
      'Reset my banking password'
    ],
    requiredEntities: [],
    optionalEntities: [],
    preconditions: ['Detection of high-risk financial, credentials, or funds transfer keywords.'],
    responseStrategy: 'Firmly decline action via automated chat. Provide direct authenticated link to official security settings portal and remind user never to share passwords in chat.',
    fallbackBehavior: 'Flag session for automated security review if suspicious patterns repeat.',
    successCriteria: 'Customer safely redirected to authenticated banking channel without exposing sensitive credentials.',
    escalationConditions: ['Suspected compromised account reported by customer.'],
    sampleResponses: [
      'For your safety and security, conversational assistants cannot modify banking passwords, view card numbers, or execute financial transfers. Please access your verified Account Security Portal directly.'
    ]
  }
];

export const BUSINESS_RULES: BusinessRule[] = [
  {
    id: 'BR-01',
    name: 'Mandatory Slot Verification',
    category: 'Slot Filling',
    condition: 'Intent is order_tracking or refund_request, but orderId entity is missing.',
    action: 'Suppress final fulfillment response; dispatch targeted single-slot prompt requesting order identifier format (e.g. DEMO-1042).',
    businessRationale: 'Prevents confusing blank lookups and ensures backend API calls are strictly parameterized.'
  },
  {
    id: 'BR-02',
    name: 'Zero Hallucination Fulfillment',
    category: 'Data Governance',
    condition: 'User provides an unverified or nonexistent demo identifier (e.g., random numbers not matching DEMO-1042/8080/9999).',
    action: 'State that the identifier was not found in the demo registry and suggest valid demo IDs rather than inventing delivery milestones.',
    businessRationale: 'Maintains user trust and mirrors production enterprise database integrity.'
  },
  {
    id: 'BR-03',
    name: 'Turn-Loop Breaker & Frustration Escalation',
    category: 'Fallbacks',
    condition: 'Clarification or fallback counter reaches >= 2 consecutive turns without slot resolution.',
    action: 'Rephrase clarification once; on subsequent repeat, immediately offer proactive human agent escalation.',
    businessRationale: 'Prevents infinite looping ("I did not understand") which causes 78% of chatbot abandonment.'
  },
  {
    id: 'BR-04',
    name: 'Contextual Topic Switching Preservation',
    category: 'Scope Control',
    condition: 'User inputs a new intent while an orderId is already stored in session context.',
    action: 'Retain known orderId entity in working state, transition intent classification to new topic, and inform user of the switch.',
    businessRationale: 'Reduces customer cognitive load by eliminating redundant information re-entry.'
  },
  {
    id: 'BR-05',
    name: 'Security & PII Airgap Guardrail',
    category: 'Guardrails',
    condition: 'User requests banking password changes, wire transfers, or sensitive credential processing.',
    action: 'Refuse automated processing immediately; render secure self-service portal guidance.',
    businessRationale: 'Complies with SOC2, PCI-DSS, and privacy compliance standards for conversational interfaces.'
  }
];
