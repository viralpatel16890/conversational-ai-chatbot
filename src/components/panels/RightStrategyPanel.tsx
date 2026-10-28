import React from 'react';
import { ConversationStrategyState, ResponseClassification } from '../../types/chatbot';
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shuffle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sliders,
  Cpu
} from 'lucide-react';

interface RightStrategyPanelProps {
  strategy: ConversationStrategyState;
}

export const RightStrategyPanel: React.FC<RightStrategyPanelProps> = ({ strategy }) => {
  const getClassificationBadge = (classification: ResponseClassification) => {
    switch (classification) {
      case 'direct_answer':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct Fulfillment
          </span>
        );
      case 'clarification':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <HelpCircle className="w-3.5 h-3.5" /> Slot Clarification
          </span>
        );
      case 'fallback':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <Shuffle className="w-3.5 h-3.5" /> Fallback & Recovery
          </span>
        );
      case 'escalation':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Human Agent Transfer
          </span>
        );
      case 'out_of_scope':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Sliders className="w-3.5 h-3.5" /> Domain Scope Redirection
          </span>
        );
      case 'policy_boundary':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Policy Guardrail
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-200">
            {classification}
          </span>
        );
    }
  };

  const entityEntries = Object.entries(strategy.extractedEntities).filter(([_, val]) => Boolean(val));

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 md:p-5 flex flex-col h-full shadow-xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 text-sm md:text-base flex items-center gap-1.5">
              Strategy & Decision Engine
            </h2>
            <p className="text-[11px] text-slate-400">Real-time Conversational Analyst Telemetry</p>
          </div>
        </div>
        <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-500/30">
          Simulated NLU
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[640px]">
        {/* Intent Recognition & Confidence Card */}
        <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Recognized Intent
            </span>
            {getClassificationBadge(strategy.responseClassification)}
          </div>
          <div className="font-bold text-slate-100 text-sm sm:text-base mb-2">
            {strategy.intentName}
          </div>

          {/* Confidence Meter */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                <span>Simulated Confidence Score:</span>
              </span>
              <span className="font-mono font-bold text-slate-200">
                {(strategy.confidenceScore * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700/80 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  strategy.confidenceScore >= 0.85
                    ? 'bg-emerald-400'
                    : strategy.confidenceScore >= 0.65
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
                style={{ width: `${Math.min(100, Math.max(10, strategy.confidenceScore * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Low (&lt; 0.65 Clarify)</span>
              <span>Direct Exec (&gt;= 0.70)</span>
            </div>
          </div>
        </div>

        {/* Extracted Entities / Slots */}
        <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/60">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
            Entity & Parameter Extraction
          </div>
          {entityEntries.length > 0 ? (
            <div className="space-y-1.5">
              {entityEntries.map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-xs bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800"
                >
                  <span className="text-slate-400 font-mono text-[11px]">{key}:</span>
                  <span className="text-emerald-300 font-medium font-mono text-[11px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic bg-slate-900/40 p-2.5 rounded-lg border border-slate-800 text-center">
              No entities bound in current session payload
            </div>
          )}

          {strategy.missingRequiredEntities.length > 0 && (
            <div className="mt-2 text-xs text-amber-300 bg-amber-950/30 border border-amber-900/50 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Missing Required Slot: <strong>{strategy.missingRequiredEntities.join(', ')}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Selected Business Rule & Decision Logic */}
        <div className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/60 space-y-2.5">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Applied Rule & Rationale</span>
            </div>
            <div className="text-xs font-semibold text-indigo-300 bg-indigo-950/50 px-2.5 py-1 rounded border border-indigo-800/40">
              {strategy.selectedRule}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium">Why this response:</span>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {strategy.decisionExplanation}
            </p>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-medium">Business / Product Goal:</span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {strategy.strategicObjective}
            </p>
          </div>
        </div>

        {/* Expected Next Step */}
        <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 flex items-start gap-2 text-xs">
          <ArrowRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-200">Expected Next Step: </span>
            <span className="text-indigo-300/90">{strategy.expectedNextStep}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        Telemetry values are illustrative simulations demonstrating conversational analyst metrics.
      </div>
    </div>
  );
};
