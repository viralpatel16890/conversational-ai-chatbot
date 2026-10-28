import React from 'react';
import {
  Info,
  CheckCircle2,
  ShieldCheck,
  Brain,
  Sliders,
  FileText,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Info className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                About This Demonstration
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Designed as a portfolio showcase demonstrating the strategic, architectural, and analytical capabilities required of a <strong>Chatbot Analyst / Conversational AI Product Analyst</strong>.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 self-start md:self-auto"
          >
            <span>Open Interactive Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Core Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fictional Business Context */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>1. Fictional Business Context</span>
            </div>
            <h2 className="text-lg font-bold text-white">Nova Retail Customer Care</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              The application simulates an omnichannel customer self-service assistant for a high-growth ecommerce retailer. In this operational model, conversational deflection balances speed of resolution against customer satisfaction (CSAT) and brand protection.
            </p>
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>• <strong>Primary Objectives:</strong> Deflect WISMO ("Where is my order") inquiries, qualify return windows, and collect slots before live handoff.</div>
              <div>• <strong>Target Audience:</strong> Retail customers seeking delivery updates and return labels.</div>
            </div>
          </div>

          {/* Conversational AI Strategy */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <Brain className="w-4 h-4" />
              <span>2. Strategic Architecture</span>
            </div>
            <h2 className="text-lg font-bold text-white">Deterministic & Explainable NLU</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike unpredictable generative wrappers, this system operates on a deterministic, testable state machine. Every interaction pairs a recognized intent with transparent business rationale, threshold checks, and fallback mechanisms.
            </p>
            <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>• <strong>Explainability:</strong> The right panel details why each response was selected.</div>
              <div>• <strong>Confidence Gates:</strong> Confidences &lt; 0.65 trigger clarification rather than wild guesses.</div>
            </div>
          </div>
        </div>

        {/* Deep Dive Pillars */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
            Key Conversational AI Analyst Competencies Showcased
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Slot Filling & Disambiguation */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-indigo-300">
                <Sliders className="w-4 h-4" />
                <span>Slot Filling & Validation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demonstrates extracting discrete parameters (such as <code className="text-indigo-300">orderId</code>) and refusing to execute null-parameter database queries. If a parameter is missing, targeted single-slot prompts are triggered.
              </p>
            </div>

            {/* Loop Breakers & Frustration */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                <AlertTriangle className="w-4 h-4" />
                <span>Loop Breaking & Warm Escalation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents chatbot loop fatigue ("I didn't understand"). Consecutive failures or customer sentiment markers proactively trigger warm human handoffs with packaged conversational context.
              </p>
            </div>

            {/* Compliance & Security Guardrails */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict Security Boundaries</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complies with SOC2, GDPR, and PCI-DSS requirements by refusing to collect banking passwords, SSNs, or execute financial transfers inside open chat transcripts.
              </p>
            </div>
          </div>
        </div>

        {/* Boundary Disclaimers */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-5 sm:p-6 text-xs text-slate-400 space-y-2">
          <div className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Demonstration Transparency & Fictional Scope</span>
          </div>
          <p className="leading-relaxed">
            • <strong>Simulated Environment:</strong> All order IDs (e.g. DEMO-1042), delivery tracking events, customer details, and analytics telemetry are entirely fictional sample data.
          </p>
          <p className="leading-relaxed">
            • <strong>No External AI API Cost or Key Needed:</strong> Runs completely locally in browser with 0 external API dependencies.
          </p>
          <p className="leading-relaxed">
            • <strong>Speech Recognition:</strong> Browser voice input uses the Web Speech API as progressive enhancement; availability depends on browser support.
          </p>
        </div>
      </div>
    </div>
  );
};
