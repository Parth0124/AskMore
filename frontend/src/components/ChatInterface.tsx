import React, { useState, useRef, useEffect } from "react";
import { Send, Menu, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch, authFetch } from "../services/api";
import TeX from "@matejmazur/react-katex";
import { Dashboard } from "./Dashboard";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface User {
  email: string;
}

interface DashboardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewChat: () => void;
  onSelectChat: (messages: Message[]) => void;
}

const MarkdownWithLatex: React.FC<{ content: string }> = ({ content }) => {
  // Pre-process content to handle standalone LaTeX expressions that aren't
  // properly captured by remark-math (like $...$ and \[...\])
  const processContent = (text: string) => {
    // First handle inline LaTeX with $...$
    let processed = text.replace(/\$([^$\n]+?)\$/g, (match, latex) => {
      return `$${latex}$`;
    });

    // Handle display LaTeX with \[...\] or $$...$$
    processed = processed.replace(/\\\[(.*?)\\\]/gs, (match, latex) => {
      return `$$${latex}$$`;
    });

    processed = processed.replace(/\$\$(.*?)\$\$/gs, (match, latex) => {
      return `$$${latex}$$`;
    });

    return processed;
  };

  const components = {
    p: ({ children, ...props }: any) => (
      <p className="my-2" {...props}>
        {children}
      </p>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      if (className === "language-math") {
        return <TeX block>{String(children).replace(/\n$/, "")}</TeX>;
      }
      return (
        <code className={inline ? "inline-code" : "block-code"} {...props}>
          {children}
        </code>
      );
    },
    inlineMath: ({ children }: any) => (
      <TeX math={String(children)} settings={{ strict: false }} />
    ),
    math: ({ children }: any) => (
      <TeX block math={String(children)} settings={{ strict: false }} />
    ),
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold my-3">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-bold my-2">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-bold my-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-base font-bold my-2">{children}</h4>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 my-2">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-5 my-2">{children}</ol>
    ),
    li: ({ children }: any) => <li className="my-1">{children}</li>,
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="table-auto border-collapse w-full">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead>{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => <tr>{children}</tr>,
    th: ({ children }: any) => (
      <th className="border border-gray-300 px-4 py-2 bg-gray-100">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-gray-300 px-4 py-2">{children}</td>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
        {children}
      </blockquote>
    ),
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-indigo-600 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  };

  // For any LaTeX expressions that weren't properly parsed by remark-math
  const processedContent = processContent(content);

  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export const ChatInterface = () => {
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  const { user, token } = useAuth() as {
    user: User | null;
    token: string | null;
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) localStorage.setItem("auth_token", token);
    else localStorage.removeItem("auth_token");
  }, [token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages, isLoading]);

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
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: input }),
          })
        : apiFetch<{ answer: string }>("/chat/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: input }),
          }));

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.answer,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      setDashboardKey((prevKey) => prevKey + 1);
    } catch (err) {
      console.error("Error sending message:", err);
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
    <div className="flex h-screen overflow-hidden">
      <Dashboard
        key={dashboardKey}
        isOpen={isDashboardOpen}
        setIsOpen={setIsDashboardOpen}
        onNewChat={handleNewChat}
        onSelectChat={(selectedMessages) => {
          setMessages(selectedMessages);
          inputRef.current?.focus();
        }}
      />

      <div
        className={`flex flex-col h-screen transition-all duration-300 ease-in-out flex-grow ${
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
                              ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.email
                                )}&background=random`
                              : "https://plus.unsplash.com/premium_photo-1677094310947-c8ffdc3d3355?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            : "https://plus.unsplash.com/premium_photo-1677094310947-c8ffdc3d3355?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={message.sender}
                        className="h-8 w-8 rounded-full flex-shrink-0"
                      />
                      <div
                        className={`mx-2 p-3 rounded-lg w-full ${
                          message.sender === "user"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.sender === "bot" ? (
                          <MarkdownWithLatex content={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-xl">
                      <img
                        src="https://plus.unsplash.com/premium_photo-1677094310947-c8ffdc3d3355?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="bot"
                        className="h-8 w-8 rounded-full flex-shrink-0"
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
    </div>
  );
};
