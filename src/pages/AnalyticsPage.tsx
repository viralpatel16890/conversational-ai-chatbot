import React, { useState } from 'react';
import { BASE_SIMULATED_ANALYTICS, METRIC_EXPLANATIONS } from '../data/analytics';
import {
  LineChart,
  TrendingUp,
  Percent,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AnalyticsPage: React.FC = () => {
  const [selectedScenarioFilter, setSelectedScenarioFilter] = useState<string>('All');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <LineChart className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
                Conversational Analytics & KPI Dashboard
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Demonstrates how a Conversational AI Product Analyst measures containment, deflection, slot-filling velocity, and escalation drivers across support customer journeys.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-mono px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulated Sample Dataset</span>
            </span>
          </div>
        </div>

        {/* Top 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Conversations */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Simulated Sessions</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                {BASE_SIMULATED_ANALYTICS.totalSimulatedConversations.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3" />
                <span>+12.4% vs last baseline sprint</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Synthetic benchmark data modeling 30 days of ecommerce volume.
            </p>
          </div>

          {/* Intent Recognition Rate */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Intent Recognition Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                {BASE_SIMULATED_ANALYTICS.intentRecognitionRate}%
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <span>Confidence &gt;= 0.65 threshold</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              {METRIC_EXPLANATIONS['Intent Recognition Rate'].definition}
            </p>
          </div>

          {/* First Contact Resolution */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>First Contact Resolution (FCR)</span>
              <Percent className="w-4 h-4 text-sky-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                {BASE_SIMULATED_ANALYTICS.firstContactResolutionRate}%
              </div>
              <span className="text-[11px] text-sky-400 flex items-center gap-1 mt-1 font-medium">
                <span>Self-service containment</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Completed fully in-bot without requiring live customer support.
            </p>
          </div>

          {/* Turns to Resolution */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Avg Turns to Resolution</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="my-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
                {BASE_SIMULATED_ANALYTICS.avgTurnsToResolution} turns
              </div>
              <span className="text-[11px] text-purple-400 flex items-center gap-1 mt-1 font-medium">
                <span>Target benchmark: 2.5 - 3.5</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              Reflects high conversational velocity with minimal friction.
            </p>
          </div>
        </div>

        {/* Secondary KPI Bar: Fallback, Escalation, Clarification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Fallback & Scope Redirection Rate</div>
              <div className="text-lg font-bold text-slate-50">
                {BASE_SIMULATED_ANALYTICS.fallbackRate}%
              </div>
              <div className="text-[10px] text-slate-500">Non-domain & unknown queries redirected</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Live Agent Escalation Rate</div>
              <div className="text-lg font-bold text-slate-50">
                {BASE_SIMULATED_ANALYTICS.escalationRate}%
              </div>
              <div className="text-[10px] text-slate-500">Explicit transfer or loop breaker trigger</div>
            </div>
          </div>

          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Clarification & Slot Prompt Rate</div>
              <div className="text-lg font-bold text-slate-50">
                {BASE_SIMULATED_ANALYTICS.clarificationRate}%
              </div>
              <div className="text-[10px] text-slate-500">Missing entity disambiguation prompts</div>
            </div>
          </div>
        </div>

        {/* Detailed Visual Breakdown Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Intent Distribution Breakdown */}
          <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-50">Traffic Distribution by Intent</h2>
                <p className="text-xs text-slate-400">Share of user volume across primary support intents</p>
              </div>
              <span className="text-xs font-mono text-indigo-400">100% Normalized</span>
            </div>

            <div className="space-y-3.5 pt-2">
              {BASE_SIMULATED_ANALYTICS.intentsBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-medium">{item.intent}</span>
                    <span className="font-mono text-slate-400">
                      {item.count.toLocaleString()} sessions ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-indigo-300">Analyst Insight: </strong>
              WISMO (Where Is My Order) represents ~46% of inbound inquiry volume. Prioritizing instant fulfillment card rendering drives the highest operational cost savings.
            </div>
          </div>

          {/* Containment vs Escalation by Scenario */}
          <div className="lg:col-span-6 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-50">Containment by Journey Type</h2>
                <p className="text-xs text-slate-400">Automated Resolution vs Escalation Rate per Scenario</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Automated</span>
                </span>
                <span className="flex items-center gap-1 text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Escalated</span>
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              {BASE_SIMULATED_ANALYTICS.containmentByScenario.map((scenario, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-medium">{scenario.scenario}</span>
                    <span className="font-mono text-slate-400">
                      {scenario.automatedPct}% bot / {scenario.escalatedPct}% human
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-purple-950 rounded-full overflow-hidden flex">
                    <div
                      className="h-full bg-emerald-500 rounded-l-full"
                      style={{ width: `${scenario.automatedPct}%` }}
                    />
                    <div
                      className="h-full bg-purple-500 rounded-r-full"
                      style={{ width: `${scenario.escalatedPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              <strong className="text-indigo-300">Analyst Insight: </strong>
              Refund qualification exhibits a 23.5% escalation rate due to return policy disputes past 30 days. This is an intentional product design decision to preserve customer goodwill rather than forcing hard refusals.
            </div>
          </div>
        </div>

        {/* Metric Definitions & Methodology Guide */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Info className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-50">Conversational Strategy Metric Glossary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(METRIC_EXPLANATIONS).map(([title, info]) => (
              <div
                key={title}
                className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-2 text-xs"
              >
                <div className="font-bold text-indigo-300">{title}</div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Definition:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{info.definition}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Why it matters to Product:</span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">{info.productImportance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
