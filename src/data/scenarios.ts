import { ScenarioDefinition } from '../types/chatbot';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'order_status',
    title: '1. Check an order status',
    category: 'Fulfillment',
    badge: 'Slot Filling',
    userPrompt: 'Where is my order?',
    demonstrates: 'Slot filling, entity validation, contextual fulfillment data lookup',
    description: 'Demonstrates handling incomplete parameters, prompting for required order identifiers (e.g. DEMO-1042), and presenting clear fulfillment tracking.',
    initialIntent: 'order_tracking',
    suggestedReplies: ['DEMO-1042', 'I don\'t have my order ID', 'Can I cancel it instead?']
  },
  {
    id: 'refund_request',
    title: '2. Request a refund',
    category: 'Exceptions',
    badge: 'Policy & Guardrail',
    userPrompt: 'I want a refund for my order.',
    demonstrates: 'Eligibility policy assessment, slot collection, simulated non-destructive resolution',
    description: 'Walks the user through return window validation, item eligibility guidelines, and non-destructive return submission.',
    initialIntent: 'refund_request',
    suggestedReplies: ['DEMO-1042', 'The item arrived damaged', 'What is the return window?']
  },
  {
    id: 'irrelevant_query',
    title: '3. Ask an unrelated question',
    category: 'Fallbacks',
    badge: 'Scope Control',
    userPrompt: 'What is the weather like today?',
    demonstrates: 'Graceful domain scope redirection without hallucinating external web queries',
    description: 'Catches out-of-domain input politely, states capability boundaries, and gently nudges the user back into ecommerce support.',
    initialIntent: 'out_of_scope_query',
    suggestedReplies: ['Track my order', 'How do refunds work?', 'I need human help']
  },
  {
    id: 'incomplete_info',
    title: '4. Provide incomplete information',
    category: 'Fulfillment',
    badge: 'Disambiguation',
    userPrompt: 'Track my order.',
    demonstrates: 'Single-parameter slot isolation, minimal friction requesting order number',
    description: 'Correctly classifies high confidence on intent while identifying missing payload entity before proceeding.',
    initialIntent: 'order_tracking',
    suggestedReplies: ['Order is DEMO-1042', 'DEMO-9999', 'I lost my receipt']
  },
  {
    id: 'ambiguous_request',
    title: '5. Ask an ambiguous question',
    category: 'Fallbacks',
    badge: 'Context Clarification',
    userPrompt: 'I need help with that thing.',
    demonstrates: 'Low confidence trigger, multi-intent menu presentation, avoiding guesswork',
    description: 'Demonstrates deliberate refusal to hallucinate; presents targeted options when confidence falls below the strategic threshold.',
    initialIntent: 'ambiguous_query',
    suggestedReplies: ['Track recent purchase', 'Return an item', 'Account login issues']
  },
  {
    id: 'repeated_unresolved',
    title: '6. Repeat an unresolved request',
    category: 'Exceptions',
    badge: 'Loop Detection',
    userPrompt: 'I want a refund. Just give me my money back!',
    demonstrates: 'Turn-loop breaker, dynamic rephrasing, proactive warm escalation offer',
    description: 'Prevents frustrating repetitive prompt loops by tracking turn count and offering assisted resolution when stuck.',
    initialIntent: 'refund_request',
    suggestedReplies: ['Provide DEMO-1042', 'Connect me to human agent', 'Start over']
  },
  {
    id: 'human_escalation',
    title: '7. Request a human agent',
    category: 'Escalation',
    badge: 'Human Handoff',
    userPrompt: 'I want to talk to a real person.',
    demonstrates: 'Deterministic human handoff protocol with simulated context package & sentiment packet',
    description: 'Packages conversation history, recognized intent, and failed slots into a structured handoff ticket for Tier-2 support.',
    initialIntent: 'human_escalation',
    suggestedReplies: ['Yes, submit handoff ticket', 'Wait, I have the order ID', 'What are support hours?']
  },
  {
    id: 'topic_change',
    title: '8. Change the subject mid-flow',
    category: 'Complex',
    badge: 'Context Switching',
    userPrompt: 'Actually, forget tracking. How do I change my delivery address?',
    demonstrates: 'Intent switching mid-session, context preservation vs clean slot reset',
    description: 'Gracefully switches from order tracking to address update while retaining customer entity references without state corruption.',
    initialIntent: 'address_change',
    suggestedReplies: ['Update address for DEMO-1042', 'Cancel whole order', 'Go back to tracking']
  },
  {
    id: 'unsupported_request',
    title: '9. Ask something outside capabilities',
    category: 'Guardrails',
    badge: 'Compliance & Safety',
    userPrompt: 'Can you change my bank account password and transfer money?',
    demonstrates: 'Strict PII/financial boundary enforcement and secure portal redirection',
    description: 'Detects high-risk banking/credential change intents and adheres to security guardrails by declining automated execution.',
    initialIntent: 'unsupported_security_action',
    suggestedReplies: ['Open secure portal', 'Speak with fraud team', 'Return to main menu']
  }
];

export const DEMO_ORDERS: Record<string, {
  id: string;
  status: string;
  expectedDelivery: string;
  carrier: string;
  items: string[];
  destination: string;
  eligibleForRefund: boolean;
}> = {
  'DEMO-1042': {
    id: 'DEMO-1042',
    status: 'Out for Delivery',
    expectedDelivery: 'Today by 5:30 PM',
    carrier: 'FastTrack Express (Tracking #FT-889102)',
    items: ['Ergonomic Wireless Keyboard', 'USB-C Magnetic Dock'],
    destination: 'Seattle, WA',
    eligibleForRefund: true
  },
  'DEMO-8080': {
    id: 'DEMO-8080',
    status: 'Delivered 3 days ago',
    expectedDelivery: 'Oct 25, 2026',
    carrier: 'ParcelPost Ground',
    items: ['Noise-Cancelling Studio Headphones'],
    destination: 'Austin, TX',
    eligibleForRefund: true
  },
  'DEMO-9999': {
    id: 'DEMO-9999',
    status: 'Delivered (Over 45 days ago)',
    expectedDelivery: 'Sept 10, 2026',
    carrier: 'BlueDart Air',
    items: ['Mechanical Keycap Set (Custom Edition)'],
    destination: 'Chicago, IL',
    eligibleForRefund: false
  }
};
