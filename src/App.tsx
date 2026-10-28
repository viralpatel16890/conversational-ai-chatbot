import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { DemoPage } from './pages/DemoPage';
import { StrategyPage } from './pages/StrategyPage';
import { ConversationFlowsPage } from './pages/ConversationFlowsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DemoPage />} />
          <Route path="/strategy" element={<StrategyPage />} />
          <Route path="/flows" element={<ConversationFlowsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
};
