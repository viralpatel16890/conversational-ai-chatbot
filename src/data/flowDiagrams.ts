export interface FlowDiagramItem {
  id: string;
  title: string;
  description: string;
  scenarioRef: string;
  strategicObjective: string;
  mermaidCode: string;
  keyDecisionNodes: {
    nodeId: string;
    label: string;
    rationale: string;
    thresholdRule: string;
  }[];
}

export const CONVERSATION_FLOWS: FlowDiagramItem[] = [
  {
    id: 'order_tracking_flow',
    title: '1. Standard Order Tracking & Slot Filling',
    description: 'Deterministic slot validation ensuring valid order ID before invoking fulfillment tracking APIs.',
    scenarioRef: 'order_status',
    strategicObjective: 'Prevent null-parameter API exceptions and eliminate user uncertainty with real-time status cards.',
    mermaidCode: `flowchart TD
    A[User: Where is my order?] --> B[Classify Intent: order_tracking]
    B --> C{Confidence >= 0.70?}
    C -->|No| D[Ask Disambiguation Question]
    C -->|Yes| E{orderId Entity Present?}
    E -->|No| F[Request Order ID: e.g. DEMO-1042]
    F --> G[User Inputs Order ID]
    G --> H{Matches Valid Demo Format?}
    H -->|Yes| I[Display Real-Time Tracking Card]
    H -->|No| J[Explain Format & Offer Sample IDs]
    J --> F
    E -->|Yes| I
    I --> K[Present Next Steps: Delivery ETA & Carrier]
    K --> L[Record Session Outcome: Resolved]`,
    keyDecisionNodes: [
      {
        nodeId: 'E',
        label: 'orderId Entity Present?',
        rationale: 'Fulfillment databases cannot execute wild query lookups safely without customer identity or tracking keys.',
        thresholdRule: 'Entity key "orderId" must match pattern DEMO-\\d{4} or prompt for input.'
      },
      {
        nodeId: 'H',
        label: 'Matches Valid Demo Format?',
        rationale: 'Zero-hallucination policy ensures the bot never fabricates synthetic logistics data for invalid identifiers.',
        thresholdRule: 'Checks demo registry keys (DEMO-1042, DEMO-8080, DEMO-9999).'
      }
    ]
  },
  {
    id: 'refund_request_flow',
    title: '2. Refund Request & Return Policy Validation',
    description: 'Validates return timeframe eligibility, collects return reasons, and presents non-destructive options.',
    scenarioRef: 'refund_request',
    strategicObjective: 'Protect merchant margin by enforcing 30-day window while offering seamless digital returns.',
    mermaidCode: `flowchart TD
    A[User: I want a refund] --> B[Classify Intent: refund_request]
    B --> C{orderId Entity Available?}
    C -->|No| D[Prompt: Provide order number]
    D --> E[User provides ID]
    E --> F{Delivery within 30-day window?}
    C -->|Yes| F
    F -->|Yes| G[Present Return Options: Label or Credit +10%]
    G --> H[User confirms choice]
    H --> I[Simulate Return Label Generation]
    F -->|No: Expired Window| J[State Return Policy: 30-Day Limit]
    J --> K{Customer disputes policy?}
    K -->|Yes| L[Escalate to Tier-2 Dispute Specialist]
    K -->|No| M[Offer Alternative Support]`,
    keyDecisionNodes: [
      {
        nodeId: 'F',
        label: 'Delivery within 30-day window?',
        rationale: 'Ensures business return policy compliance automatically before generating postage costs.',
        thresholdRule: 'Order delivered <= 30 days ago (e.g. DEMO-1042: Yes; DEMO-9999: Expired).'
      },
      {
        nodeId: 'L',
        label: 'Escalate to Tier-2 Specialist',
        rationale: 'When policy exceptions are disputed, bots should never argue; transfer with full context preserves CSAT.',
        thresholdRule: 'Customer pushback counter >= 1 on expired policy.'
      }
    ]
  },
  {
    id: 'ambiguous_clarification_flow',
    title: '3. Ambiguous Intent & Disambiguation Menu',
    description: 'Intercepts vague queries and requests targeted clarification instead of guessing user intent.',
    scenarioRef: 'ambiguous_request',
    strategicObjective: 'Eliminate false-positive actions and conversational confusion caused by overconfident NLU guesses.',
    mermaidCode: `flowchart TD
    A[User: I need help with that thing] --> B[Intent Classifier Score: 0.42]
    B --> C{Confidence >= 0.65?}
    C -->|No: Ambiguous| D[Trigger Disambiguation Strategy]
    D --> E[Present Top-3 Intent Quick Chips]
    E --> F{User selects chip or clarifies?}
    F -->|Selects Chip| G[Switch Intent: High Confidence]
    G --> H[Execute Selected Standard Flow]
    F -->|Still Vague / Second Failure| I[Loop Breaker Rule Triggered]
    I --> J[Proactively Offer Human Agent Transfer]`,
    keyDecisionNodes: [
      {
        nodeId: 'C',
        label: 'Confidence >= 0.65?',
        rationale: 'Low confidence thresholds lead to incorrect automated workflows, frustrating users.',
        thresholdRule: 'Simulated threshold: 0.65 minimum required for direct execution.'
      },
      {
        nodeId: 'I',
        label: 'Loop Breaker Rule Triggered',
        rationale: 'Never trap users in clarifying loops more than 2 consecutive turns.',
        thresholdRule: 'clarificationCount >= 2 -> Proactive agent offer.'
      }
    ]
  },
  {
    id: 'out_of_scope_flow',
    title: '4. Out of Scope Fallback & Scope Control',
    description: 'Gracefully deflects non-retail questions, defends scope boundaries, and redirects to retail actions.',
    scenarioRef: 'irrelevant_query',
    strategicObjective: 'Prevent hallucination, maintain enterprise brand trust, and guide visitors to core value tasks.',
    mermaidCode: `flowchart TD
    A[User: What is the weather today?] --> B[Classify Domain: Out-of-Scope 0.96]
    B --> C[Polite Boundary Notice: Retail Only]
    C --> D[Display In-Scope Quick Chips: Track, Returns, Support]
    D --> E{User clicks chip or switches topic?}
    E -->|Yes: Switches to In-Scope| F[Seamlessly Resume Retail Flow]
    E -->|No: Persists Out-of-Scope| G[Reiterate Capabilities & Offer Agent]`,
    keyDecisionNodes: [
      {
        nodeId: 'C',
        label: 'Polite Boundary Notice',
        rationale: 'Clear scope communication manages user expectations without being dismissive or pretending to have live web browsing.',
        thresholdRule: 'Zero external web search hallucination allowed.'
      }
    ]
  },
  {
    id: 'repeated_failure_escalation_flow',
    title: '5. Repeated Failure & Sentiment Escalation',
    description: 'Monitors turn counts and sentiment cues to initiate warm handoffs before user churn occurs.',
    scenarioRef: 'repeated_unresolved',
    strategicObjective: 'Protect retention and customer satisfaction by recognizing friction early.',
    mermaidCode: `flowchart TD
    A[User repeats unresolved request] --> B[Increment Unresolved Turn Counter]
    B --> C{Unresolved Counter >= 2?}
    C -->|Turn 1| D[Rephrase Clarification with Structured Examples]
    C -->|Turn 2+| E[Trigger Proactive Escalation Protocol]
    E --> F[Compile Handoff Packet: Intent, Entities, History]
    F --> G[Display Simulated Agent Queue Card]
    G --> H[Offer Agent Callback or Queue Wait]`,
    keyDecisionNodes: [
      {
        nodeId: 'C',
        label: 'Unresolved Counter >= 2?',
        rationale: 'Industry benchmark: Repeated failures beyond 2 turns cause steep drops in user trust.',
        thresholdRule: 'clarificationCount >= 2 triggers escalation menu.'
      }
    ]
  },
  {
    id: 'unsupported_security_flow',
    title: '6. Unsupported Financial / Security Guardrail',
    description: 'Enforces hard privacy, PCI-DSS, and credential boundaries by declining sensitive operations in chat.',
    scenarioRef: 'unsupported_request',
    strategicObjective: 'Compliance with SOC2, GDPR, and PCI-DSS rules against credential processing in open chat.',
    mermaidCode: `flowchart TD
    A[User: Change my bank password / Wire funds] --> B[Security Classifier: Financial/Credential Risk]
    B --> C[Evaluate Risk: HIGH PRIVACY SENSITIVITY]
    C --> D[Refuse Direct Execution in Chat]
    D --> E[Deliver Direct Authenticated Portal Deep-Link]
    E --> F[Display Security Notice: Never share passwords]
    F --> G[Record Security Guardrail Audit Log]`,
    keyDecisionNodes: [
      {
        nodeId: 'C',
        label: 'Evaluate Risk: HIGH PRIVACY',
        rationale: 'Conversational chat transcripts must never store or process banking passwords or unauthenticated fund transfers.',
        thresholdRule: 'Keywords matching password, transfer money, credit card trigger immediate guardrail.'
      }
    ]
  }
];
