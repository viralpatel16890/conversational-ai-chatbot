# Conversational AI Strategy Lab
> **Interactive Chatbot Analyst & Product Strategy Portfolio Demo**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-conversational--ai--chatbot--n89n.vercel.app-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://conversational-ai-chatbot-n89n.vercel.app)
[![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests%20Passing-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🌐 Public Live Deployment

- **Production URL:** [https://conversational-ai-chatbot-n89n.vercel.app](https://conversational-ai-chatbot-n89n.vercel.app)
- **Deployment Status:** Ready (Active Production)
- **Zero Configuration Needed:** No sign-up, payment, backend service, or live AI API keys required.

---

## 🎯 Project Purpose

This project is an interactive, recruiter-facing portfolio demonstration designed for a **Chatbot Analyst / Conversational AI Product Analyst** role.

Rather than presenting a generic chat interface or static portfolio page, this application models and explains the complete discipline of conversational AI design:
- **How intents are classified and evaluated against confidence thresholds**
- **How parameter slots (e.g. order IDs) are extracted and validated**
- **How out-of-scope inquiries are politely deflected to preserve brand credibility**
- **How turn-loop breakers protect user experience from repetitive bot loops**
- **How structured context packages are created for live human escalations**
- **How conversational metrics (containment, FCR, deflection, velocity) are monitored**

---

## 📱 Interactive User Experience

### 1. Realistic Mobile Chatbot Mockup (Desktop Centerpiece)
- Convincing smartphone container with animated speech bubbles, typing indicators, suggested reply chips, and independent message scrolling.
- **3 Input Modalities:**
  - **Method 1: Clickable Scenario Pills** — Immediate discovery path for interviewers.
  - **Method 2: Free-form Text Input** — Fully conversational, submit with `Enter`.
  - **Method 3: Browser Voice Recognition** — Microphone button leveraging Web Speech API with automatic interim transcription and error handling.

### 2. Strategy & Decision Telemetry (Right Panel)
- Real-time contextual updates for every message:
  - **Recognized Intent:** e.g., Order Tracking, Refund Qualification, Ambiguity Clarification.
  - **Confidence Meter:** Simulated 0.0 to 1.0 score tied to strategic execution thresholds.
  - **Extracted Slots:** Values bound to session memory (e.g., `orderId: DEMO-1042`).
  - **Selected Business Rule:** The operational guideline governing the response.
  - **Product Rationale:** Clear analytical explanation of *why* the bot responded in this specific manner.

---

## 🤖 9 Scripted Conversational Scenarios

| # | Scenario | Intent | Primary Analyst Capability Demonstrated |
|---|---|---|---|
| 1 | **Check Order Status** | `order_tracking` | Mandatory slot filling, demo ID lookup, instant fulfillment card rendering. |
| 2 | **Request a Refund** | `refund_request` | Delivery timestamp qualification (30-day window policy) & store credit incentives. |
| 3 | **Unrelated / Out of Scope** | `out_of_scope_query` | Scope control without hallucinating external web searches; retail redirection. |
| 4 | **Incomplete Information** | `order_tracking` | Parameter isolation; asking for order identifier before invoking fulfillment. |
| 5 | **Ambiguous Request** | `ambiguous_query` | Low confidence gate (< 0.65) triggering a 3-choice disambiguation menu. |
| 6 | **Repeated Unresolved Request** | `refund_request` | Turn-loop breaker: detects failure loops and initiates warm escalation. |
| 7 | **Request a Human Agent** | `human_escalation` | Frictionless handoff with pre-compiled context packet, intent summary & sentiment. |
| 8 | **Change Subject Mid-Flow** | `address_change` | Topic switching with session entity preservation without state corruption. |
| 9 | **Unsupported Financial / Credential** | `unsupported_security_action` | Strict compliance with SOC2 / PCI-DSS rules against collecting credentials in chat. |

---

## 🧪 Valid Demo Test Identifiers

You can test the conversational slot-filling engine with the following sample IDs:
- **`DEMO-1042`**: Out for delivery today with FastTrack Express (Eligible for return).
- **`DEMO-8080`**: Delivered 3 days ago via ParcelPost Ground (Eligible for return).
- **`DEMO-9999`**: Delivered 45 days ago — Triggers **30-Day Return Policy Guardrail**.
- **Any unlisted ID** (e.g. `DEMO-0000`): Triggers **Zero-Hallucination Fallback**.

---

## 🧭 Multi-Page Exploration

- **`/` (Live Demo):** 3-panel desktop experience (Guided Prompts | Smartphone Bot | Strategy Panel).
- **`/strategy` (Strategy & Intents):** Complete intent catalog, required/optional slots, and 5 governance rules.
- **`/flows` (Conversation Flows):** 6 interactive Mermaid flowcharts with zoom/pan controls and decision node breakdowns.
- **`/analytics` (Analytics Dashboard):** Simulated KPIs including FCR, Deflection, Turn Velocity, and Containment share.
- **`/about` (About This Demo):** Business context, product rationale, and architectural boundaries.

---

## 📁 Repository Structure

```
conversational-ai-chatbot/
├── public/
│   ├── favicon.svg                   # Custom bot SVG icon
│   └── robots.txt                    # Search crawler policy
├── src/
│   ├── components/
│   │   ├── chatbot/
│   │   │   └── PhoneChatbotMockup.tsx # Centered phone container, message stream & composer
│   │   ├── layout/
│   │   │   └── Header.tsx             # Global navigation bar & brand indicator
│   │   ├── panels/
│   │   │   ├── LeftGuidedPanel.tsx    # 9 Clickable guided demo scenario pills
│   │   │   └── RightStrategyPanel.tsx # Live NLU telemetry, confidence & decision rationale
│   │   └── ui/
│   │       └── MermaidViewer.tsx      # Mermaid diagram viewer with zoom/pan controls
│   ├── data/
│   │   ├── analytics.ts               # Simulated KPI data and metric definitions
│   │   ├── flowDiagrams.ts            # Mermaid flow definitions and decision node rules
│   │   ├── intents.ts                 # Intent catalog specifications & business rules
│   │   └── scenarios.ts               # 9 Scripted scenarios & demo orders registry
│   ├── hooks/
│   │   ├── useChat.ts                 # Chatbot state machine & conversation telemetry hook
│   │   └── useSpeechRecognition.ts    # Web Speech API progressive enhancement hook
│   ├── pages/
│   │   ├── AboutPage.tsx              # Business context and design principles
│   │   ├── AnalyticsPage.tsx          # Analytics dashboard & KPI breakdowns
│   │   ├── ConversationFlowsPage.tsx  # Flowchart visualizer for 6 core flows
│   │   ├── DemoPage.tsx               # Primary 3-column interactive lab layout
│   │   └── StrategyPage.tsx           # Intent taxonomy & decision rules catalog
│   ├── services/
│   │   └── conversationEngine.ts      # Deterministic NLU classifier, entity extraction & rules
│   ├── test/
│   │   ├── conversationEngine.test.ts # Vitest automated tests covering all scenarios
│   │   └── setup.ts                   # Test environment setup
│   ├── types/
│   │   └── chatbot.ts                 # TypeScript interfaces for intents, messages & state
│   ├── App.tsx                        # Client-side router configuration
│   ├── main.tsx                       # Entry point
│   └── style.css                      # Tailwind styles and subtle scrollbars
├── index.html                         # HTML template with metadata
├── package.json                       # Scripts and dependencies
├── tsconfig.json                      # Strict TypeScript compiler configuration
├── vercel.json                        # Vercel SPA rewrite configuration
└── vite.config.ts                     # Vite bundler and test configuration
```

---

## 🛠️ Local Development & Testing

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/viralpatel16890/conversational-ai-chatbot.git
cd conversational-ai-chatbot
npm install
```

### 2. Start Local Dev Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```
Executes all 9 unit tests covering entity extraction, slot filling, boundary guardrails, loop breaking, and human escalation.

### 4. Run Strict TypeScript Type Check
```bash
npm run typecheck
```

### 5. Build for Production
```bash
npm run build
```

---

## 🚀 Deployment Instructions (Vercel)

The repository includes a ready-to-deploy [`vercel.json`](file:///E:/Github%20Projects/conversational-ai-chatbot/vercel.json) configured for single-page application routing.

To deploy a copy to your own Vercel account:
1. Log into [Vercel](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import `viralpatel16890/conversational-ai-chatbot`.
4. Framework preset **Vite** is auto-detected. Click **Deploy**.

---

## 🛡️ Disclaimers & Operational Boundaries

- **Simulated Demonstration:** All order tracking data, shipping milestones, and analytics metrics are simulated for demonstration purposes.
- **Privacy & Security:** Voice input is processed in-browser via the Web Speech API and is never recorded or transmitted to external servers.
- **Zero API Dependency:** Operates completely offline/client-side with zero external AI inference costs.
