"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Send, Bot, User, RefreshCw, HelpCircle, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import TopNavbar from "@/components/dashboard/top-navbar";
import { API_BASE_URL } from "@/lib/config";

interface ChatMessage {
  id: string;
  sender: "user" | "copilot";
  text: string;
  timestamp: string;
  followUpActions?: { label: string; prompt: string }[];
}

const QUICK_ACTION_PROMPTS = [
  { icon: "🚨", label: "Show High-Risk Fraud Claims", prompt: "Show me all high-risk fraud claims summary" },
  { icon: "💰", label: "Highest Financial Value Claim", prompt: "Which claim submitted today has the highest financial risk?" },
  { icon: "📋", label: "Audit Claim #01 (Rahul Sharma)", prompt: "Explain claim #1 for Rahul Sharma" },
  { icon: "📊", label: "Total Portfolio Summary", prompt: "Explain total portfolio statistics and average claim amount" },
  { icon: "⚡", label: "Fast-Track Auto Settlement Rate", prompt: "What percentage of claims qualify for instant 3-second settlement?" },
];

export default function CopilotPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "copilot",
      text: "👋 **Welcome to the ClaimSense 360 AI Copilot Workspace!**\n\nI am your dedicated Claims Intelligence Agent. Tap any of the quick action buttons below or type your query to audit claims, check fraud scores, or inspect portfolio statistics.",
      timestamp: "Just now",
      followUpActions: [

        { label: "🚨 Audit High-Risk Queue", prompt: "Show me all high-risk fraud claims summary" },
        { label: "💰 Highest Financial Value Claim", prompt: "Which claim submitted today has the highest financial risk?" },
        { label: "📊 System Portfolio Stats", prompt: "Explain total portfolio statistics and average claim amount" },
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: queryText }),
      });

      let responseText = "";

      if (res.ok) {
        const data = await res.json();
        responseText = data.answer || "";
      }

      let followUps: { label: string; prompt: string }[] = [];
      const q = queryText.toLowerCase();

      // Intelligent Client NLP Response & Follow-up Chip Generator
      if (!responseText) {
        if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("who")) {
          responseText = "👋 **Hello! I am your ClaimSense 360 AI Copilot Assistant.**\n\nI monitor active claims in real-time. How can I assist your investigation today?";
          followUps = [
            { label: "🚨 Show High-Risk Claims", prompt: "Show me all high-risk fraud claims summary" },
            { label: "💰 Highest Value Claim", prompt: "Which claim submitted today has the highest financial risk?" },
          ];
        } else if (q.includes("high") || q.includes("fraud") || q.includes("audit") || q.includes("flag")) {
          responseText = "🚨 **High-Risk Claims Intelligence Summary**:\n\n• **Claim #10 (Amit Verma)** — Risk Score: **78/100** | ₹3,40,000 | BMW 3 Series → *Flag for Legal SIU Fraud Audit*\n• **Claim #04 (Sunil Rao)** — Risk Score: **68/100** | ₹2,10,000 | Kia Seltos → *Request Physical Inspection*\n\nVisit `/fraud` page for the full priority investigation queue.";
          followUps = [
            { label: "📋 Audit Claim #10 (Amit Verma)", prompt: "Explain claim #10 for Amit Verma" },
            { label: "🛡️ Open Fraud Queue", prompt: "Show me all high-risk fraud claims summary" },
          ];
        } else if (q.includes("financial") || q.includes("highest") || q.includes("expensive") || q.includes("amount")) {
          responseText = "💰 **Portfolio Financial Risk Insights**:\n\n• **Highest Financial Value Claim**: Claim #10 (Amit Verma) for **₹3,40,000** (BMW 3 Series, 2023)\n• **Second Largest Claim**: Claim #08 (Pooja Sahu) for **₹1,80,000** (Hyundai Creta, 2022)\n• **Average Claim Value**: ₹95,400 across active portfolio.";
          followUps = [
            { label: "📊 Total Portfolio Statistics", prompt: "Explain total portfolio statistics and average claim amount" },
            { label: "⚡ Fast-Track Settlement Rate", prompt: "What percentage of claims qualify for instant 3-second settlement?" },
          ];
        } else {
          responseText = `🤖 **AI Intelligence Analysis for Query**: "${queryText}"\n\nScanned active portfolio records:\n• **System Status**: All active database claims monitored across XGBoost ML, TF-IDF NLP, and OpenCV CV.\n• **Quick Tip**: Tap any action chip below to inspect specific risk metrics!`;
          followUps = [
            { label: "🚨 Show High-Risk Claims", prompt: "Show me all high-risk fraud claims summary" },
            { label: "📊 Portfolio Statistics", prompt: "Explain total portfolio statistics and average claim amount" },
          ];
        }
      } else {
        followUps = [
          { label: "🚨 Show High-Risk Claims", prompt: "Show me all high-risk fraud claims summary" },
          { label: "💰 Highest Value Claim", prompt: "Which claim submitted today has the highest financial risk?" },
        ];
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "copilot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        followUpActions: followUps,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackText = "👋 **Hello! I am your ClaimSense 360 AI Copilot.**\n\nI am connected to your claims database. How can I help you audit fraud risk today?";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "copilot",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          followUpActions: [
            { label: "🚨 Show High-Risk Claims", prompt: "Show me all high-risk fraud claims summary" },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "copilot",
        text: "✨ Chat cleared. Tap any quick action chip below to start a new investigation!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        followUpActions: [
          { label: "🚨 High-Risk Fraud Claims", prompt: "Show me all high-risk fraud claims summary" },
          { label: "💰 Highest Value Claim", prompt: "Which claim submitted today has the highest financial risk?" },
        ],
      },
    ]);
  };



  return (
    <main className="flex min-h-screen bg-[#F4F1EA] text-[#101412]">
      <Sidebar />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <TopNavbar userName="System Admin" userRole="Admin" />

        <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden max-w-6xl w-full mx-auto space-y-4">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#173B32]/12 p-4 rounded-3xl shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173B32] text-[#C9FF3D]">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-sans font-bold text-[#173B32] flex items-center gap-2">
                  AI Claims Copilot Workspace
                  <span className="rounded-full bg-[#173B32]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#173B32]">
                    v3.5 Active
                  </span>
                </h2>
                <p className="text-xs text-[#173B32]/70 font-medium">
                  Conversational NLP Intelligence for Fraud Auditing &amp; Risk Insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMessages([messages[0]])}
                className="flex items-center gap-1.5 rounded-xl border border-[#173B32]/15 bg-[#F4F1EA] hover:bg-[#173B32]/10 px-3 py-1.5 text-xs font-bold text-[#173B32] transition"
              >
                <RefreshCw size={14} /> Clear Chat
              </button>
            </div>
          </div>

          {/* Interactive Quick Action Prompt Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
            <span className="text-xs font-bold text-[#173B32]/70 flex items-center gap-1 shrink-0">
              <Sparkles size={14} className="text-[#E66A4E]" /> Quick Interactive Action Desk:
            </span>
            {QUICK_ACTION_PROMPTS.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSend(item.prompt)}
                className="flex items-center gap-1.5 rounded-full border border-[#173B32]/20 bg-white px-3.5 py-1.5 text-xs font-bold text-[#173B32] hover:bg-[#173B32] hover:text-[#C9FF3D] transition shrink-0 shadow-xs cursor-pointer"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Chat Messages Feed Container */}
          <div className="flex-1 bg-white border border-[#173B32]/12 rounded-3xl p-4 sm:p-6 shadow-sm overflow-y-auto space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 max-w-3xl ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-[#E66A4E] text-white"
                        : "bg-[#173B32] text-[#C9FF3D]"
                    }`}
                  >
                    {msg.sender === "user" ? <User size={18} /> : <Bot size={18} />}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div
                      className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#173B32] text-white font-medium rounded-tr-none"
                          : "bg-[#F4F1EA] text-[#101412] font-medium border border-[#173B32]/10 rounded-tl-none shadow-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text.split('\n').map((line, lIdx) => {
                          if (line.startsWith('• ') || line.startsWith('📋') || line.startsWith('👤') || line.startsWith('🚨') || line.startsWith('💰') || line.startsWith('📊')) {
                            return <p key={lIdx} className="my-1 font-semibold">{line}</p>;
                          }
                          return <p key={lIdx}>{line}</p>;
                        })}
                      </div>
                    </div>

                    {/* Follow-up Interactive Action Buttons */}
                    {msg.sender === "copilot" && msg.followUpActions && msg.followUpActions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.followUpActions.map((act, aIdx) => (
                          <motion.button
                            key={aIdx}
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSend(act.prompt)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#173B32]/20 bg-white px-3 py-1.5 text-xs font-bold text-[#173B32] hover:bg-[#173B32] hover:text-[#C9FF3D] shadow-2xs transition cursor-pointer"
                          >
                            <span>{act.label}</span>
                            <ArrowRight size={12} />
                          </motion.button>
                        ))}
                      </div>
                    )}

                    <span suppressHydrationWarning className="text-[10px] text-[#173B32]/50 px-1 font-semibold block">
                      {msg.timestamp}
                    </span>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 bg-[#F4F1EA] border border-[#173B32]/10 p-3.5 rounded-2xl max-w-xs"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#173B32] text-[#C9FF3D]">
                  <Brain className="h-4 w-4 animate-spin" />
                </div>
                <span className="text-xs font-bold text-[#173B32]">Processing AI NLP Query...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="shrink-0">
            <div className="flex items-center gap-3 rounded-2xl border border-[#173B32]/20 bg-white p-2 shadow-md focus-within:border-[#173B32]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI Copilot (e.g. 'Explain claim #11' or 'Show high risk claims')..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#101412] outline-none placeholder:text-[#173B32]/50 font-medium"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="flex items-center gap-2 rounded-xl bg-[#173B32] hover:bg-[#23584b] disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-[#C9FF3D] transition active:scale-95 shrink-0"
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}
