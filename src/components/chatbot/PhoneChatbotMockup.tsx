import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldAlert,
  Info
} from 'lucide-react';
import { ChatMessage, ResponseClassification } from '../../types/chatbot';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

interface PhoneChatbotMockupProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onReset: () => void;
  activeScenarioId?: string;
}

export const PhoneChatbotMockup: React.FC<PhoneChatbotMockupProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onReset
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    transcript,
    isSupported: isSpeechSupported,
    errorMessage: speechError,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();

  // Keep input text synced with speech transcript when speaking
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Scroll to bottom when messages update or typing indicator changes
  useEffect(() => {
    // Scroll only the chat container; scrollIntoView would also scroll the whole page
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isListening) {
      stopListening();
    }
    onSendMessage(inputText);
    setInputText('');
    clearTranscript();
  };

  const handleMicToggle = () => {
    if (!isSpeechSupported) {
      alert('Browser speech recognition is not supported in this browser. Please use text input or prompt chips.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleChipClick = (reply: string) => {
    onSendMessage(reply);
  };

  const formatClassification = (classification?: ResponseClassification) => {
    switch (classification) {
      case 'direct_answer':
        return { label: 'Direct Resolution', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
      case 'clarification':
        return { label: 'Slot Clarification', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
      case 'fallback':
        return { label: 'Recovery Fallback', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' };
      case 'escalation':
        return { label: 'Agent Escalation', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' };
      case 'policy_boundary':
        return { label: 'Security Boundary', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
      case 'out_of_scope':
        return { label: 'Scope Redirection', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' };
      default:
        return null;
    }
  };

  // Render markdown text formatting (bolding, lists, links) simply and cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Parse **bold** and simple links
          const parts = line.split(/(\*\*.*?\*\*)/g);
          return (
            <p key={idx} className={line.startsWith('•') ? 'pl-2 text-slate-200' : ''}>
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={pIdx} className="font-semibold">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[700px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800/80 flex flex-col overflow-hidden">
      {/* Top Phone Speaker & Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full flex items-center justify-center z-30 border border-slate-800">
        <div className="w-12 h-1.5 bg-slate-800 rounded-full mr-2" />
        <div className="w-2.5 h-2.5 bg-indigo-950 rounded-full border border-indigo-700/50" />
      </div>

      {/* Internal Phone Screen Container */}
      <div className="w-full h-full bg-phone rounded-[34px] flex flex-col overflow-hidden pt-7 relative border border-slate-800/60">
        {/* Chatbot Top Bar */}
        <div className="px-4 py-2.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 ring-1 ring-emerald-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-100">Nova Assistant</span>
                <span className="text-[9px] uppercase px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 font-mono rounded border border-indigo-500/30">
                  Demo
                </span>
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Simulated Online • Ready</span>
              </div>
            </div>
          </div>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-50 hover:bg-slate-800 transition-colors"
            title="Reset Chat Session"
            aria-label="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3.5 scroll-smooth">
          <div className="text-center my-1">
            <span className="text-[10px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-800">
              Interactive Simulated Conversation
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const classificationBadge = !isUser ? formatClassification(msg.classification) : null;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all`}
              >
                {/* Classification Tag */}
                {classificationBadge && (
                  <div
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md border mb-1 flex items-center gap-1 ${classificationBadge.color}`}
                  >
                    <span>{classificationBadge.label}</span>
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-left ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  {renderFormattedText(msg.text)}

                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isUser ? 'text-indigo-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggested Reply Chips attached to assistant message */}
                {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestedReplies.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleChipClick(reply)}
                        className="text-[11px] bg-slate-800/90 hover:bg-indigo-900/50 hover:text-indigo-200 text-slate-300 border border-slate-700 hover:border-indigo-500/50 px-2.5 py-1 rounded-full transition-all text-left shadow-xs cursor-pointer active:scale-95"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/50 text-slate-400 px-3 py-2 rounded-2xl rounded-bl-xs w-20">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Speech Error Banner */}
        {speechError && (
          <div className="px-3 py-1.5 bg-rose-950/80 border-t border-rose-800 text-[11px] text-rose-300 flex items-center justify-between">
            <span className="truncate pr-1">{speechError}</span>
            <button onClick={clearTranscript} className="text-slate-50 hover:underline text-[10px]">
              Dismiss
            </button>
          </div>
        )}

        {/* Listening Active Banner */}
        {isListening && (
          <div className="px-3 py-1.5 bg-indigo-950/90 border-t border-indigo-700 text-[11px] text-indigo-300 flex items-center justify-between animate-pulse">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Listening... Speak into microphone</span>
            </span>
            <button
              onClick={stopListening}
              className="text-xs font-semibold text-rose-300 hover:underline"
            >
              Stop
            </button>
          </div>
        )}

        {/* Message Input Composer */}
        <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 z-20">
          <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Type a question or order ID...'}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs sm:text-sm rounded-full pl-3.5 pr-8 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-500"
              />
              {/* Optional Voice Input Button */}
              <button
                type="button"
                onClick={handleMicToggle}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-800'
                }`}
                title={
                  isSpeechSupported
                    ? isListening
                      ? 'Stop Voice Input'
                      : 'Voice Input (Browser Speech API)'
                    : 'Voice input not supported in this browser'
                }
                aria-label="Microphone speech input"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-full transition-all shadow-md active:scale-95 disabled:pointer-events-none"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1.5 px-1">
            <span>Press Enter to send</span>
            <span>Mic uses Web Speech API</span>
          </div>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="h-4 bg-slate-950 flex items-center justify-center">
          <div className="w-28 h-1 bg-slate-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};
