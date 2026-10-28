import React, { useState } from 'react';
import { CONVERSATION_FLOWS } from '../data/flowDiagrams';
import { MermaidViewer } from '../components/ui/MermaidViewer';
import { GitFork, ArrowRight, CheckCircle2, HelpCircle, Layers, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConversationFlowsPage: React.FC = () => {
  const [selectedFlowId, setSelectedFlowId] = useState<string>(CONVERSATION_FLOWS[0].id);
  const navigate = useNavigate();

  const currentFlow = CONVERSATION_FLOWS.find((f) => f.id === selectedFlowId) || CONVERSATION_FLOWS[0];

  return (
    <div className="min-h-screen bg-app text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <GitFork className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
                Conversational Flow Architectures
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Visualizes how user input flows through intent classification, entity extraction gates, policy validation checks, and escalation decision branches.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 self-start md:self-auto"
          >
            <span>Launch Active Scenario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Flow Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {CONVERSATION_FLOWS.map((flow) => {
            const isSelected = flow.id === selectedFlowId;
            return (
              <button
                key={flow.id}
                onClick={() => setSelectedFlowId(flow.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{flow.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Flow Detailed View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Visual Diagram Canvas */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-50">{currentFlow.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{currentFlow.description}</p>
              </div>
              <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
                Mermaid Flowchart
              </span>
            </div>

            {/* Render Interactive Mermaid Diagram */}
            <MermaidViewer chart={currentFlow.mermaidCode} id={currentFlow.id} />

            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <span>Use zoom controls (+ / -) to inspect detailed branch labels.</span>
              <span className="text-indigo-400 font-mono text-[10px]">Deterministic Logic Sync</span>
            </div>
          </div>

          {/* Decision Node Breakdown & Strategy Rationale */}
          <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Strategic Objective
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/60">
                {currentFlow.strategicObjective}
              </p>
            </div>

            {/* Decision Nodes Inspection */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>Critical Decision Nodes</span>
              </div>

              <div className="space-y-3">
                {currentFlow.keyDecisionNodes.map((node, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 rounded-xl p-3.5 border border-slate-700/60 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300">
                        Node {node.nodeId}: {node.label}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        Product Rationale:
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {node.rationale}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/80 text-[11px] text-emerald-400 font-mono">
                      Rule: {node.thresholdRule}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Flow in Interactive Chatbot</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
