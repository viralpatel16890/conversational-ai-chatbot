import React from 'react';
import { SCENARIOS } from '../../data/scenarios';
import { Play, Sparkles, CheckCircle, HelpCircle, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

interface LeftGuidedPanelProps {
  onSelectScenario: (scenarioId: string) => void;
  activeScenarioId?: string;
  onReset: () => void;
}

export const LeftGuidedPanel: React.FC<LeftGuidedPanelProps> = ({
  onSelectScenario,
  activeScenarioId,
  onReset
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 md:p-5 flex flex-col h-full shadow-xl">
      {/* Intro Header */}
      <div className="border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="font-semibold text-slate-100 text-sm md:text-base">
              Guided Demo Scenarios
            </h2>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors bg-slate-800/80 hover:bg-slate-800 px-2 py-1 rounded"
            title="Reset simulated conversation"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Click any scenario below to trigger a pre-configured conversation branch. Watch how the central mobile bot responds and how the strategy panel calculates business decisions in real-time.
        </p>
      </div>

      {/* Scenarios List */}
      <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 max-h-[640px]">
        {SCENARIOS.map((scenario) => {
          const isActive = activeScenarioId === scenario.id;

          const getCategoryIcon = (category: string) => {
            switch (category) {
              case 'Fulfillment':
                return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
              case 'Exceptions':
                return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
              case 'Fallbacks':
                return <HelpCircle className="w-3.5 h-3.5 text-sky-400" />;
              case 'Guardrails':
                return <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />;
              default:
                return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
            }
          };

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1.5 group ${
                isActive
                  ? 'bg-indigo-950/60 border-indigo-500/50 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/20'
                  : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5 font-medium text-slate-200 group-hover:text-white">
                  {getCategoryIcon(scenario.category)}
                  <span>{scenario.title}</span>
                </div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {scenario.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 italic line-clamp-1 group-hover:text-slate-300">
                "{scenario.userPrompt}"
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-500">
                <span className="truncate pr-2">{scenario.demonstrates}</span>
                <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
                  <span>Launch</span>
                  <Play className="w-2.5 h-2.5 fill-current" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="text-slate-500">Demo Mode: Deterministic Engine</span>
        <span className="text-indigo-400 font-medium">9 Scripted Scenarios</span>
      </div>
    </div>
  );
};
