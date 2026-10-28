import React, { useState } from 'react';
import { LeftGuidedPanel } from '../components/panels/LeftGuidedPanel';
import { PhoneChatbotMockup } from '../components/chatbot/PhoneChatbotMockup';
import { RightStrategyPanel } from '../components/panels/RightStrategyPanel';
import { useChat } from '../hooks/useChat';
import { Sparkles, Compass, HelpCircle, Layers } from 'lucide-react';

export const DemoPage: React.FC = () => {
  const {
    messages,
    strategyState,
    isTyping,
    sendMessage,
    selectScenario,
    resetConversation
  } = useChat();

  const [activeTabMobile, setActiveTabMobile] = useState<'chat' | 'scenarios' | 'strategy'>('chat');

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      {/* Top Value Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border-b border-indigo-900/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-300">
              <strong>Recruiter Demonstration:</strong> Interactive Conversational AI Strategy, Fallback Management & Intent Telemetry.
            </span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="hidden sm:inline">Simulated NLU • Zero API Keys Required</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-emerald-300 font-medium">9 Scripted Scenarios Active</span>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {/* Mobile View Switcher Tabs (Only visible on small devices) */}
        <div className="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-slate-800 mb-4">
          <button
            onClick={() => setActiveTabMobile('scenarios')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTabMobile === 'scenarios'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Scenarios</span>
          </button>
          <button
            onClick={() => setActiveTabMobile('chat')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTabMobile === 'chat'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Mobile Bot</span>
          </button>
          <button
            onClick={() => setActiveTabMobile('strategy')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTabMobile === 'strategy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Strategy</span>
          </button>
        </div>

        {/* 3-Column Desktop Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,1fr)_minmax(0,420px)_minmax(260px,1fr)] gap-5 items-start flex-1">
          {/* Left Column: Guided Demo Scenarios */}
          <div
            className={`min-w-0 h-full ${
              activeTabMobile === 'scenarios' ? 'block' : 'hidden lg:block'
            }`}
          >
            <LeftGuidedPanel
              onSelectScenario={(id) => {
                selectScenario(id);
                // On mobile, auto-switch to chat view so recruiter sees the interaction
                setActiveTabMobile('chat');
              }}
              activeScenarioId={strategyState.currentScenarioId}
              onReset={resetConversation}
            />
          </div>

          {/* Center Column: Phone Mockup (Focal Point) */}
          <div
            className={`min-w-0 flex justify-center items-center ${
              activeTabMobile === 'chat' ? 'block' : 'hidden lg:flex'
            }`}
          >
            <PhoneChatbotMockup
              messages={messages}
              isTyping={isTyping}
              onSendMessage={sendMessage}
              onReset={resetConversation}
              activeScenarioId={strategyState.currentScenarioId}
            />
          </div>

          {/* Right Column: Strategic Insights & Telemetry */}
          <div
            className={`min-w-0 h-full ${
              activeTabMobile === 'strategy' ? 'block' : 'hidden lg:block'
            }`}
          >
            <RightStrategyPanel strategy={strategyState} />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-3 px-4 text-center text-xs text-slate-500">
        Conversational AI Strategy Lab — Designed for Product Analyst & Conversational Strategist portfolio evaluation.
      </footer>
    </div>
  );
};
