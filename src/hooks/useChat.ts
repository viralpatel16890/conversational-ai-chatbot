import { useState, useCallback, useRef, useEffect } from 'react';
import {
  ChatMessage,
  ConversationStrategyState,
  SessionAnalyticsEvent
} from '../types/chatbot';
import { SCENARIOS } from '../data/scenarios';
import { evaluateUserInput, extractEntities } from '../services/conversationEngine';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: '👋 Welcome to the **Conversational AI Strategy Lab**!\n\nI am Nova, an interactive enterprise retail support assistant. Try picking any scenario on the left or type your own question below.',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  classification: 'direct_answer',
  suggestedReplies: [
    'Where is my order?',
    'I want a refund for DEMO-1042',
    'What is the weather today?',
    'I want to talk to a real person'
  ],
  metadata: {
    intentId: 'greeting',
    confidence: 1.0,
    ruleTriggered: 'INITIAL_ONBOARDING'
  }
};

const INITIAL_STRATEGY_STATE: ConversationStrategyState = {
  currentScenarioId: 'order_status',
  currentIntentId: 'greeting',
  intentName: 'Welcome & Interactive Guided Onboarding',
  confidenceScore: 1.0,
  extractedEntities: {},
  missingRequiredEntities: [],
  selectedRule: 'INIT-01: Proactive Discovery Onboarding',
  decisionExplanation: 'Present clear introductory context and high-frequency scenario shortcuts to orient the user immediately.',
  strategicObjective: 'Maximize initial engagement and minimize cognitive barrier to starting the evaluation demo.',
  responseClassification: 'direct_answer',
  expectedNextStep: 'User selects a guided scenario or types an organic question.',
  clarificationCount: 0,
  isEscalated: false,
  topicChanged: false
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [strategyState, setStrategyState] = useState<ConversationStrategyState>(INITIAL_STRATEGY_STATE);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [sessionEvents, setSessionEvents] = useState<SessionAnalyticsEvent[]>([]);
  const turnsCountRef = useRef<number>(0);

  const sendMessage = useCallback((rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    turnsCountRef.current += 1;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add User Message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: now
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // 2. Simulate Thoughtful Assistant Response (350ms delay for natural pacing)
    setTimeout(() => {
      const evalResult = evaluateUserInput(text, {
        currentScenarioId: strategyState.currentScenarioId,
        currentIntentId: strategyState.currentIntentId,
        extractedEntities: strategyState.extractedEntities,
        clarificationCount: strategyState.clarificationCount,
        isEscalated: strategyState.isEscalated
      });

      const topicSwitched =
        strategyState.currentIntentId !== 'greeting' &&
        strategyState.currentIntentId !== evalResult.intentId;

      const newClarificationCount =
        evalResult.classification === 'clarification'
          ? strategyState.clarificationCount + 1
          : 0;

      // Update Strategy State
      const updatedStrategy: ConversationStrategyState = {
        currentScenarioId: strategyState.currentScenarioId,
        currentIntentId: evalResult.intentId,
        intentName: evalResult.intentName,
        confidenceScore: evalResult.confidence,
        extractedEntities: evalResult.extractedEntities,
        missingRequiredEntities: evalResult.missingRequiredEntities,
        selectedRule: evalResult.selectedRule,
        decisionExplanation: evalResult.decisionExplanation,
        strategicObjective: evalResult.strategicObjective,
        responseClassification: evalResult.classification,
        expectedNextStep: evalResult.expectedNextStep,
        clarificationCount: newClarificationCount,
        isEscalated: evalResult.isEscalated,
        escalationReason: evalResult.escalationDetails?.reason,
        previousIntentId: strategyState.currentIntentId,
        topicChanged: topicSwitched
      };

      setStrategyState(updatedStrategy);

      // Assistant Message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        sender: 'assistant',
        text: evalResult.assistantMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        classification: evalResult.classification,
        suggestedReplies: evalResult.suggestedReplies,
        metadata: {
          intentId: evalResult.intentId,
          confidence: evalResult.confidence,
          entitiesExtracted: evalResult.extractedEntities as Record<string, string>,
          ruleTriggered: evalResult.selectedRule,
          escalationDetails: evalResult.escalationDetails
        }
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      // Record Session Analytics Event
      const event: SessionAnalyticsEvent = {
        id: `event-${Date.now()}`,
        timestamp: new Date().toISOString(),
        scenarioId: strategyState.currentScenarioId,
        intentId: evalResult.intentId,
        classification: evalResult.classification,
        confidence: evalResult.confidence,
        turnsCount: turnsCountRef.current,
        escalated: evalResult.isEscalated,
        clarificationNeeded: evalResult.classification === 'clarification'
      };

      setSessionEvents((prev) => [...prev, event]);
    }, 400);
  }, [strategyState]);

  const selectScenario = useCallback((scenarioId: string) => {
    const targetScenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!targetScenario) return;

    // Reset strategy state for fresh scenario exploration
    setStrategyState((prev) => ({
      ...INITIAL_STRATEGY_STATE,
      currentScenarioId: scenarioId,
      currentIntentId: targetScenario.initialIntent,
      intentName: targetScenario.title,
      strategicObjective: targetScenario.demonstrates
    }));

    // Trigger scenario prompt
    sendMessage(targetScenario.userPrompt);
  }, [sendMessage]);

  const resetConversation = useCallback(() => {
    turnsCountRef.current = 0;
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setStrategyState(INITIAL_STRATEGY_STATE);
    setIsTyping(false);
  }, []);

  return {
    messages,
    strategyState,
    isTyping,
    sessionEvents,
    sendMessage,
    selectScenario,
    resetConversation
  };
}
