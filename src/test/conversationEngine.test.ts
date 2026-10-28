import { describe, it, expect } from 'vitest';
import { extractEntities, evaluateUserInput } from '../services/conversationEngine';

describe('Conversational NLU & Decision Engine', () => {
  const baseState = {
    currentScenarioId: 'order_status',
    currentIntentId: 'greeting',
    extractedEntities: {},
    clarificationCount: 0,
    isEscalated: false
  };

  it('extracts order ID entities correctly across common formats', () => {
    const res1 = extractEntities('Where is my order DEMO-1042?');
    expect(res1.orderId).toBe('DEMO-1042');

    const res2 = extractEntities('Check tracking for demo_8080 please');
    expect(res2.orderId).toBe('DEMO-8080');
  });

  it('enforces mandatory slot filling when order ID is missing for order tracking', () => {
    const result = evaluateUserInput('Where is my order?', baseState);
    expect(result.intentId).toBe('order_tracking');
    expect(result.classification).toBe('clarification');
    expect(result.missingRequiredEntities).toContain('orderId');
  });

  it('delivers direct fulfillment when valid order ID is provided', () => {
    const result = evaluateUserInput('Where is my order DEMO-1042?', baseState);
    expect(result.intentId).toBe('order_tracking');
    expect(result.classification).toBe('direct_answer');
    expect(result.assistantMessage).toContain('Out for Delivery');
    expect(result.missingRequiredEntities.length).toBe(0);
  });

  it('triggers zero-hallucination fallback when invalid demo order ID is supplied', () => {
    const result = evaluateUserInput('Track order DEMO-0000', baseState);
    expect(result.classification).toBe('fallback');
    expect(result.assistantMessage).toContain('could not find order');
  });

  it('enforces return policy guardrail for expired orders (>30 days)', () => {
    const stateWithOldOrder = {
      ...baseState,
      extractedEntities: { orderId: 'DEMO-9999' }
    };
    const result = evaluateUserInput('I want a refund for DEMO-9999', stateWithOldOrder);
    expect(result.classification).toBe('policy_boundary');
    expect(result.assistantMessage).toContain('past our standard **30-day return window**');
  });

  it('detects domain boundary and responds with polite scope redirection on out-of-scope query', () => {
    const result = evaluateUserInput('What is the weather like in Seattle today?', baseState);
    expect(result.intentId).toBe('out_of_scope_query');
    expect(result.classification).toBe('out_of_scope');
    expect(result.assistantMessage).toContain('shopping and order support');
  });

  it('handles ambiguous query and breaks turn loop after repeated failure', () => {
    // Turn 1: Clarification
    const resTurn1 = evaluateUserInput('I need help with that thing', baseState);
    expect(resTurn1.classification).toBe('clarification');

    // Turn 2: Loop breaker triggers proactive escalation
    const resTurn2 = evaluateUserInput('It does not work', {
      ...baseState,
      clarificationCount: 1
    });
    expect(resTurn2.classification).toBe('escalation');
    expect(resTurn2.isEscalated).toBe(true);
    expect(resTurn2.assistantMessage).toContain('connect you with a live agent');
  });

  it('enforces high-risk security & banking guardrail (SOC2 / PCI-DSS compliance)', () => {
    const result = evaluateUserInput('Can you change my bank account password and transfer money?', baseState);
    expect(result.intentId).toBe('unsupported_security_action');
    expect(result.classification).toBe('policy_boundary');
    expect(result.assistantMessage).toContain('Security Notice');
  });

  it('triggers explicit human agent transfer with context summary packet', () => {
    const stateWithContext = {
      ...baseState,
      extractedEntities: { orderId: 'DEMO-1042' }
    };
    const result = evaluateUserInput('I want to talk to a real person', stateWithContext);
    expect(result.intentId).toBe('human_escalation');
    expect(result.classification).toBe('escalation');
    expect(result.isEscalated).toBe(true);
    expect(result.escalationDetails?.contextSummary).toContain('DEMO-1042');
  });
});
