import { SimulatedAnalyticsMetric } from '../types/chatbot';

export const BASE_SIMULATED_ANALYTICS: SimulatedAnalyticsMetric = {
  totalSimulatedConversations: 14850,
  intentRecognitionRate: 94.6,
  firstContactResolutionRate: 82.4,
  fallbackRate: 5.4,
  escalationRate: 7.8,
  clarificationRate: 11.2,
  avgTurnsToResolution: 2.7,
  intentsBreakdown: [
    { intent: 'Order Tracking & WISMO', count: 6850, percentage: 46.1 },
    { intent: 'Refunds & Returns', count: 3420, percentage: 23.0 },
    { intent: 'Address & Delivery Updates', count: 1820, percentage: 12.3 },
    { intent: 'Out of Scope / Non-Domain', count: 1150, percentage: 7.7 },
    { intent: 'Human Escalation', count: 980, percentage: 6.6 },
    { intent: 'Unsupported Security Guardrail', count: 630, percentage: 4.3 }
  ],
  containmentByScenario: [
    { scenario: 'Order Status Check', automatedPct: 91.2, escalatedPct: 8.8 },
    { scenario: 'Refund Qualification', automatedPct: 76.5, escalatedPct: 23.5 },
    { scenario: 'Address Change Modification', automatedPct: 84.0, escalatedPct: 16.0 },
    { scenario: 'Out-of-Scope Fallback', automatedPct: 96.4, escalatedPct: 3.6 },
    { scenario: 'Ambiguous Clarification', automatedPct: 88.0, escalatedPct: 12.0 },
    { scenario: 'Security Compliance', automatedPct: 99.1, escalatedPct: 0.9 }
  ]
};

export const METRIC_EXPLANATIONS: Record<string, { definition: string; productImportance: string }> = {
  'Intent Recognition Rate': {
    definition: 'Percentage of user utterances mapped to a defined system intent with confidence score above the operational threshold (0.65).',
    productImportance: 'Core health check of NLU/intent catalog coverage. Low numbers signal training data blindspots or confusing taxonomy.'
  },
  'First Contact Resolution (FCR)': {
    definition: 'Percentage of customer sessions resolved purely via automated conversational steps without requiring human handoff or repeated sessions.',
    productImportance: 'Primary driver of deflection and cost savings. Balances self-service efficiency against CSAT.'
  },
  'Fallback & Redirection Rate': {
    definition: 'Percentage of turns triggering domain boundary guardrails or clarifying disambiguation menus.',
    productImportance: 'Indicates how effectively boundary prompts gently redirect out-of-domain curiosity back into revenue and support funnels.'
  },
  'Escalation Rate': {
    definition: 'Percentage of chats routed to human tier-2 support, either proactively (sentiment/complexity) or upon direct user demand.',
    productImportance: 'High escalation highlights automation bottlenecks; too low could indicate trapped or frustrated users forced through infinite loops.'
  },
  'Clarification Rate': {
    definition: 'Frequency with which the bot requests slot disambiguation before executing a workflow.',
    productImportance: 'Shows precision in parameter collection; prevents broken downstream API calls caused by false assumptions.'
  },
  'Average Turns to Resolution': {
    definition: 'Mean number of back-and-forth messages exchanged between user and assistant to complete a task.',
    productImportance: 'Measures conversational velocity. A well-designed chatbot keeps transactional inquiries between 2 and 4 turns.'
  }
};
