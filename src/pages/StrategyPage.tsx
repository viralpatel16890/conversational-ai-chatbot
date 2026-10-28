import React, { useState } from 'react';
import { INTENTS_CATALOG, BUSINESS_RULES } from '../data/intents';
import { IntentDefinition, BusinessRule } from '../types/chatbot';
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shuffle,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Layers,
  Database,
  Search,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StrategyPage: React.FC = () => {
  const [selectedIntentId, setSelectedIntentId] = useState<string>(INTENTS_CATALOG[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ruleFilter, setRuleFilter] = useState<string>('All');

  const navigate = useNavigate();

  const selectedIntent = INTENTS_CATALOG.find((i) => i.id === selectedIntentId) || INTENTS_CATALOG[0];

  const filteredIntents = INTENTS_CATALOG.filter((intent) => {
    const matchesSearch =
      intent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intent.businessObjective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredRules = BUSINESS_RULES.filter((rule) => {
    if (ruleFilter === 'All') return true;
    return rule.category === ruleFilter;
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Hero Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Intent Catalog & Decision Rules
              </h1>
            </div>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Demonstrates the conversational taxonomy, required slots, fallback behaviors, and governance policies defining system behavior. Inspect how user intents map to deterministic business actions.
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-md active:scale-95 self-start md:self-auto"
          >
            <span>Test in Live Chatbot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Section 1: Intent Catalog Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Intent Selector & Search */}
          <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="font-semibold text-sm text-slate-200">Catalog of Intents</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {INTENTS_CATALOG.length} defined
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search intents or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Intent Cards List */}
            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredIntents.map((intent) => {
                const isSelected = intent.id === selectedIntentId;
                return (
                  <button
                    key={intent.id}
                    onClick={() => setSelectedIntentId(intent.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex flex-col gap-1 ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{intent.name}</span>
                      <span className="text-[10px] font-mono text-indigo-400">
                        {intent.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {intent.businessObjective}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>Slots: {intent.requiredEntities.length > 0 ? intent.requiredEntities.join(', ') : 'None'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Intent Specification */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedIntent.id}
                  </span>
                  <span className="text-xs text-slate-400">• High Confidence Threshold: 0.70</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedIntent.name}</h2>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/50 hover:bg-indigo-900/50 px-3 py-1.5 rounded-lg border border-indigo-800 transition-colors self-start sm:self-auto"
              >
                <span>Launch in Live Bot</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Business Objective */}
            <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Business & Operational Objective
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedIntent.businessObjective}
              </p>
            </div>

            {/* 2-Column Specs: Training Examples & Required Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Training / User Utterances */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Example User Phrases (Utterances)
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedIntent.examplePhrases.map((phrase, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-indigo-400 font-mono text-[11px]">{idx + 1}.</span>
                      <span className="italic">"{phrase}"</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Slots / Entities */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Required Entities (Mandatory Slots)
                  </span>
                  {selectedIntent.requiredEntities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedIntent.requiredEntities.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium flex items-center gap-1.5"
                        >
                          <Database className="w-3 h-3" />
                          <span>{slot}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None required (direct execution)</span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Optional Entities
                  </span>
                  {selectedIntent.optionalEntities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedIntent.optionalEntities.map((slot, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/50 text-xs font-mono"
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">None</span>
                  )}
                </div>
              </div>
            </div>

            {/* Strategic Response Strategy & Fallback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-1.5">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Response Strategy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIntent.responseStrategy}
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-1.5">
                <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shuffle className="w-3.5 h-3.5" /> Fallback & Loop Recovery
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIntent.fallbackBehavior}
                </p>
              </div>
            </div>

            {/* Success & Escalation Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-1.5">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Success Criteria
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedIntent.successCriteria}
                </p>
              </div>

              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-1.5">
                <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Escalation Triggers
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {selectedIntent.escalationConditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-400">•</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Conversational Business Rules Engine */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">
                  Conversational Governance & Decision Rules
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Policy rules governing slot verification, zero hallucination, loop breaking, and privacy boundaries.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Slot Filling', 'Data Governance', 'Fallbacks', 'Scope Control', 'Guardrails'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setRuleFilter(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    ruleFilter === cat
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
                      {rule.id}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {rule.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mb-2">{rule.name}</h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold block">Condition:</span>
                      <p className="text-slate-300 italic">{rule.condition}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">Automated Action:</span>
                      <p className="text-slate-200">{rule.action}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg">
                  <strong className="text-indigo-300">Product Rationale: </strong>
                  {rule.businessRationale}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
