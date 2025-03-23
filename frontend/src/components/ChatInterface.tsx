import React, { useState, useRef, useEffect } from "react";
import { Send, Menu, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, authFetch } from "../services/api";
import ReactMarkdown from "react-markdown";
import { Dashboard } from "./Dashboard";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export const ChatInterface = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, token } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save token to localStorage for Dashboard component
  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

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
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <Dashboard
        isOpen={isDashboardOpen}
        setIsOpen={setIsDashboardOpen}
        onNewChat={handleNewChat}
      />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ease-in-out ${
          isDashboardOpen ? "ml-64" : "ml-0"
        }`}
      >
        {!isDashboardOpen && (
          <button
            onClick={() => setIsDashboardOpen(true)}
            className="fixed top-4 left-4 z-10 bg-white p-2 rounded-md shadow-md"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}

        <div className="flex flex-col h-full">
          {/* Messages container with constrained height */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 pt-14">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                <p className="text-gray-400">
                  Send a message to start the conversation
                </p>
                <form
                  onSubmit={handleSend}
                  className="flex items-center space-x-2 w-full max-w-xl px-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex-shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start max-w-xl ${
                        message.sender === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
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
                        {message.sender === "bot" ? (
                          <div className="markdown-content">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-xl">
                      <img
                        src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="bot"
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="mx-2 p-3 rounded-lg bg-gray-100 text-gray-900 flex items-center space-x-2">
                        <Loader className="h-5 w-5 animate-spin text-indigo-600" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input container */}
          {messages.length > 0 && (
            <div className="border-t border-gray-400 bg-white p-4">
              <form
                onSubmit={handleSend}
                className="flex items-center space-x-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
