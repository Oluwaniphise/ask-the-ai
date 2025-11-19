"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "user", content: "Can you explain TypeScript to me?" },
    {
      role: "assistant",
      content:
        "TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing, which helps catch errors early and improves code quality.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (input.trim()) {
      const userMessage = input;
      setMessages([...messages, { role: "user", content: userMessage }]);
      setInput("");

      setLoading(true);
      try {
        const response = await fetch("/api/openai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: userMessage }),
        });

        const data = await response.json().finally(() => {
          setLoading(false);
        });

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
      } catch (error) {
        console.error("Error calling API:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
          },
        ]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="w-full bg-slate-800/50 border-b border-slate-700 py-4 px-6">
        <h1 className="text-2xl font-bold text-white text-center">
          AI Chat Assistant
        </h1>
      </div>

      {/* Conversation History */}
      <div className="flex-1 w-full overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3xl rounded-2xl px-6 py-4 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-100"
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-75">
                  {msg.role === "user" ? "You" : "Assistant"}
                </div>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full bg-slate-800/50 border-t border-slate-700 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading && <small>Generating...</small>}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your message here..."
            className="w-full h-32 bg-slate-700 text-white rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Ask the AI
          </button>
        </div>
      </div>
    </div>
  );
}
