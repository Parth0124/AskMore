import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, authFetch } from "../services/api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "This is an AI-Based Chatbot.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const newMessage: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setIsLoading(true);
      const response = await (user && token
        ? authFetch<{ answer: string }>("/chat/ask", token, {
            method: "POST",
            body: JSON.stringify({ question: input }),
          })
        : apiFetch<{ answer: string }>("/chat/ask", {
            method: "POST",
            body: JSON.stringify({ question: input }),
          }));

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.answer,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Failed to get response. Please try again.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] ml-64">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start max-w-xl ${
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <img
                src={
                  message.sender === "user"
                    ? user
                      ? `https://ui-avatars.com/api/?name=${user.email}&background=random`
                      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    : "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt={message.sender}
                className="h-8 w-8 rounded-full"
              />
              <div
                className={`mx-2 p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
