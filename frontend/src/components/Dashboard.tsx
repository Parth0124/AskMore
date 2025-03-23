import React, { useState, useEffect, useRef } from "react";
import { Menu, MessageSquare, PlusCircle, Loader } from "lucide-react";
import { authFetch } from "../services/api";

interface ChatMessage {
  question: string;
  answer: string;
  timestamp: string;
}

interface ChatEntry {
  id: string;
  question: string;
  answer: string;
  time: Date;
}

interface DashboardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewChat?: () => void;
  onSelectChat?: (messages: any[]) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isOpen,
  setIsOpen,
  onNewChat,
  onSelectChat,
}) => {
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("auth_token");
  const isLoggedIn = !!token;
  const pollingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initial fetch when component mounts or dashboard opens
    if (isLoggedIn && isOpen) {
      fetchChatHistory();

      // Set up polling interval (every 5 seconds)
      pollingIntervalRef.current = window.setInterval(() => {
        if (isLoggedIn && isOpen) {
          fetchChatHistory(false); // false means don't show loading indicator for polling
        }
      }, 5000);
    }

    // Clean up interval when component unmounts or dashboard closes
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLoggedIn, isOpen]);

  const fetchChatHistory = async (showLoading = true) => {
    if (!token) return;

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const chatHistory = await authFetch<ChatMessage[]>("/chat/", token);

      const allChats = chatHistory.map((chat, index) => ({
        id: `chat-${index}`,
        question: chat.question,
        answer: chat.answer,
        time: new Date(chat.timestamp),
      }));

      setChats(allChats);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setError("Failed to load chat history");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleChatSelect = (chatEntry: ChatEntry) => {
    if (onSelectChat) {
      const messages = [
        { id: Date.now(), text: chatEntry.question, sender: "user" },
        { id: Date.now() + 1, text: chatEntry.answer, sender: "bot" },
      ];
      onSelectChat(messages);
    }
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white w-64 shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out z-20`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chats</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onNewChat && onNewChat()}
            className="p-1 hover:bg-gray-100 rounded-full"
            title="New Chat"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="p-4 text-center text-gray-500">
          Please log in to see your chat history
        </div>
      )}

      {isLoggedIn && loading && (
        <div className="flex items-center justify-center p-4 text-gray-500">
          <Loader className="h-5 w-5 animate-spin mr-2" />
          <span>Loading chats...</span>
        </div>
      )}

      {isLoggedIn && error && (
        <div className="p-4 text-center text-red-500">{error}</div>
      )}

      {isLoggedIn && !loading && (
        <div className="p-4">
          {chats.length === 0 ? (
            <p className="text-sm text-gray-400">No chats available</p>
          ) : (
            <ul>
              {chats.map((chat) => (
                <li key={chat.id} className="mb-2">
                  <button
                    onClick={() => handleChatSelect(chat)}
                    className="w-full flex items-center p-2 hover:bg-gray-100 rounded text-left"
                  >
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-2 text-gray-500" />
                      <span className="text-sm truncate max-w-[180px]">
                        {chat.question}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
