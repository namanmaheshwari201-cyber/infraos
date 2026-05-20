import {
  Bot,
  Check,
  Copy,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  Send,
  Sparkles,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { getRuleBasedResponse } from "../services/geminiService";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: "user" | "assistant";
  content: string;
  id: number;
}

const QUICK_ACTIONS = [
  {
    label: "Top Delay Risks",
    icon: "⚠️",
    prompt:
      "What are the top project delay risks across NHAI and MoRTH projects right now?",
  },
  {
    label: "Arbitration Alerts",
    icon: "⚖️",
    prompt:
      "Summarize the current arbitration exposure and commercial risk for major infrastructure contracts in India.",
  },
  {
    label: "Executive Brief",
    icon: "📊",
    prompt:
      "Give me a 3-point executive briefing on the current status of India's National Infrastructure Pipeline.",
  },
];

// ─── Message Renderer ──────────────────────────────────────────────────────────
function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="text-xs leading-relaxed space-y-1">
      {lines.map((line, idx) => {
        const key = `l-${idx}`;
        if (line.startsWith("## "))
          return (
            <p
              key={key}
              className="font-bold text-[11px] mt-2"
              style={{ color: "#00D4FF" }}
            >
              {line.slice(3)}
            </p>
          );
        if (line.startsWith("# "))
          return (
            <p
              key={key}
              className="font-black text-xs mt-2"
              style={{ color: "#00D4FF" }}
            >
              {line.slice(2)}
            </p>
          );
        if (line.startsWith("**") && line.endsWith("**"))
          return (
            <p key={key} className="font-bold">
              {line.replace(/\*\*/g, "")}
            </p>
          );
        if (line.startsWith("- ") || line.startsWith("* "))
          return (
            <p key={key} className="flex gap-1.5">
              <span style={{ color: "#00D4FF" }}>•</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        if (line.trim() === "") return <div key={key} className="h-1" />;
        return <p key={key}>{line}</p>;
      })}
    </div>
  );
}

// ─── Copy Button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy message"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ml-1 shrink-0"
      style={{ color: copied ? "#00D4FF" : "rgba(255,255,255,0.35)" }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "assistant",
      content:
        "InfraOS AI Intelligence Layer Active. How can I assist with infrastructure analysis today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const msgIdRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const sendMessage = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || isTyping) return;

    setInput("");
    const userId = msgIdRef.current++;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: msg },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getRuleBasedResponse(msg);
      const aiId = msgIdRef.current++;
      setMessages((prev) => [
        ...prev,
        { id: aiId, role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 400);
  };

  const clearChat = () => {
    msgIdRef.current = 1;
    setMessages([
      {
        id: 0,
        role: "assistant",
        content:
          "Chat cleared. InfraOS AI Copilot is ready. How can I assist you, Naman?",
      },
    ]);
  };

  const isBlocked = isTyping;

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open InfraOS AI Copilot"
        data-ocid="ai_copilot.open_modal_button"
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-[0_0_30px_rgba(0,212,255,0.4)] flex items-center justify-center z-50",
          isOpen && "hidden",
        )}
        style={{ background: "#00D4FF", color: "#000" }}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            data-ocid="ai_copilot.dialog"
            className={cn(
              "fixed bottom-6 right-6 border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden",
              isExpanded ? "w-[600px] h-[700px]" : "w-96 h-[520px]",
            )}
            style={{
              background: "#0D1117",
              borderColor: "rgba(0,212,255,0.15)",
            }}
          >
            {/* Header */}
            <div
              className="p-4 border-b flex items-center justify-between flex-shrink-0"
              style={{
                background: "#080B0F",
                borderColor: "rgba(0,212,255,0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    color: "#00D4FF",
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <h3
                    className="text-xs font-black uppercase tracking-widest italic"
                    style={{ color: "#fff" }}
                  >
                    InfraOS AI Copilot
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        background: "#00E676",
                      }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-tighter"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Satellite Sync Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  aria-label="Clear chat"
                  data-ocid="ai_copilot.clear_button"
                  title="Clear chat"
                  className="p-2 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <Trash2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? "Minimize" : "Maximize"}
                  data-ocid="ai_copilot.toggle"
                  className="p-2 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {isExpanded ? (
                    <Minimize2 size={16} />
                  ) : (
                    <Maximize2 size={16} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close InfraOS AI Copilot"
                  data-ocid="ai_copilot.close_button"
                  className="p-2 transition-colors hover:text-white"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              data-ocid="ai_copilot.messages"
              style={{ background: "rgba(8,11,15,0.5)" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 group",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row",
                  )}
                  data-ocid={`ai_copilot.message.${i + 1}`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                    style={
                      msg.role === "user"
                        ? {
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.4)",
                            borderColor: "rgba(255,255,255,0.1)",
                          }
                        : {
                            background: "rgba(0,212,255,0.05)",
                            color: "#00D4FF",
                            borderColor: "rgba(0,212,255,0.1)",
                          }
                    }
                  >
                    {msg.role === "user" ? (
                      <User size={14} />
                    ) : (
                      <Sparkles size={14} />
                    )}
                  </div>
                  <div className="max-w-[80%] flex flex-col gap-1">
                    <div
                      className={cn(
                        "p-3 rounded-2xl",
                        msg.role === "user"
                          ? "rounded-tr-none border"
                          : "rounded-tl-none border",
                      )}
                      style={
                        msg.role === "user"
                          ? {
                              background: "rgba(255,255,255,0.05)",
                              color: "#fff",
                              borderColor: "rgba(255,255,255,0.1)",
                            }
                          : {
                              background: "rgba(0,212,255,0.05)",
                              color: "rgba(255,255,255,0.85)",
                              borderColor: "rgba(0,212,255,0.1)",
                            }
                      }
                    >
                      <MessageContent content={msg.content} />
                    </div>
                    {msg.role === "assistant" && (
                      <div className="flex justify-start">
                        <CopyButton text={msg.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div
                  className="flex gap-3"
                  data-ocid="ai_copilot.loading_state"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      background: "rgba(0,212,255,0.05)",
                      color: "#00D4FF",
                      borderColor: "rgba(0,212,255,0.1)",
                    }}
                  >
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div
                    className="p-3 rounded-2xl text-[10px] uppercase font-black tracking-widest italic animate-pulse"
                    style={{
                      background: "rgba(0,212,255,0.05)",
                      color: "#00D4FF",
                    }}
                  >
                    Analyzing...
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div
              className="px-3 pt-3 pb-1 border-t flex gap-1.5 overflow-x-auto flex-shrink-0"
              style={{
                background: "#080B0F",
                borderColor: "rgba(0,212,255,0.08)",
              }}
            >
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendMessage(action.prompt)}
                  disabled={isBlocked}
                  data-ocid={`ai_copilot.quick_action.${action.label.toLowerCase().replace(/ /g, "_")}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight whitespace-nowrap transition-all disabled:opacity-40 border"
                  style={{
                    background: "rgba(0,212,255,0.04)",
                    borderColor: "rgba(0,212,255,0.18)",
                    color: "rgba(0,212,255,0.8)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,212,255,0.12)";
                    e.currentTarget.style.color = "#00D4FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,212,255,0.04)";
                    e.currentTarget.style.color = "rgba(0,212,255,0.8)";
                  }}
                >
                  <Zap size={10} />
                  {action.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div
              className="p-3 pt-2 border-t flex-shrink-0"
              style={{
                background: "#080B0F",
                borderColor: "rgba(0,212,255,0.12)",
              }}
            >
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything — infrastructure, tenders, stocks, or just say hello..."
                  disabled={isBlocked}
                  data-ocid="ai_copilot.input"
                  className="w-full rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/30 focus:outline-none transition-all pr-12 border disabled:opacity-50"
                  style={{
                    background: "#0D1117",
                    borderColor: "rgba(0,212,255,0.2)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(0,212,255,0.2)";
                  }}
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isBlocked}
                  aria-label="Send message"
                  data-ocid="ai_copilot.send_button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all disabled:opacity-30"
                  style={{ color: "#00D4FF" }}
                >
                  <Send size={18} />
                </button>
              </div>
              <p
                className="text-[9px] mt-2 text-center font-bold uppercase tracking-tighter"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                InfraOS National AI Intelligence Layer
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
