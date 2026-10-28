export type MessageSender = 'user' | 'assistant' | 'system';

export type ResponseClassification = 
  | 'direct_answer'
  | 'clarification'
  | 'fallback'
  | 'escalation'
  | 'out_of_scope'
  | 'topic_switch'
  | 'policy_boundary';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  classification?: ResponseClassification;
  suggestedReplies?: string[];
  metadata?: {
    intentId?: string;
    confidence?: number;
    scenarioId?: string;
    entitiesExtracted?: Record<string, string>;
    ruleTriggered?: string;
    escalationDetails?: {
      reason: string;
      tier: string;
      contextSummary: string;
    };
  };
}

export interface ExtractedEntities {
  orderId?: string;
  refundReason?: string;
  category?: string;
  itemType?: string;
  customerSentiment?: 'neutral' | 'frustrated' | 'urgent';
  [key: string]: string | undefined;
}

export interface ConversationStrategyState {
  currentScenarioId: string;
  currentIntentId: string;
  intentName: string;
  confidenceScore: number; // 0.0 - 1.0 (illustrative simulated)
  extractedEntities: ExtractedEntities;
  missingRequiredEntities: string[];
  selectedRule: string;
  decisionExplanation: string;
  strategicObjective: string;
  responseClassification: ResponseClassification;
  expectedNextStep: string;
  clarificationCount: number;
  isEscalated: boolean;
  escalationReason?: string;
  previousIntentId?: string;
  topicChanged: boolean;
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  category: 'Fulfillment' | 'Exceptions' | 'Fallbacks' | 'Guardrails' | 'Complex' | 'Escalation';
  badge: string;
  userPrompt: string;
  demonstrates: string;
  description: string;
  initialIntent: string;
  suggestedReplies?: string[];
}

export interface IntentDefinition {
  id: string;
  name: string;
  businessObjective: string;
  examplePhrases: string[];
  requiredEntities: string[];
  optionalEntities: string[];
  preconditions: string[];
  responseStrategy: string;
  fallbackBehavior: string;
  successCriteria: string;
  escalationConditions: string[];
  sampleResponses: string[];
}

export interface BusinessRule {
  id: string;
  name: string;
  category: 'Data Governance' | 'Fallbacks' | 'Escalation' | 'Scope Control' | 'Slot Filling' | 'Guardrails';
  condition: string;
  action: string;
  businessRationale: string;
}

export interface SimulatedAnalyticsMetric {
  totalSimulatedConversations: number;
  intentRecognitionRate: number; // e.g., 94.2%
  firstContactResolutionRate: number; // e.g., 81.5%
  fallbackRate: number; // e.g., 5.8%
  escalationRate: number; // e.g., 8.3%
  clarificationRate: number; // e.g., 12.1%
  avgTurnsToResolution: number; // e.g., 2.8
  intentsBreakdown: { intent: string; count: number; percentage: number }[];
  containmentByScenario: { scenario: string; automatedPct: number; escalatedPct: number }[];
}

export interface SessionAnalyticsEvent {
  id: string;
  timestamp: string;
  scenarioId: string;
  intentId: string;
  classification: ResponseClassification;
  confidence: number;
  turnsCount: number;
  escalated: boolean;
  clarificationNeeded: boolean;
}
