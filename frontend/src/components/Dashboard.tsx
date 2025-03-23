import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Menu, MessageSquare, PlusCircle, Loader } from "lucide-react";
import { authFetch } from "../services/api";

interface ChatMessage {
  question: string;
  answer: string;
  timestamp: string;
}

interface ChatEntry {
  id: string;
  title: string;
  time: Date;
}

interface DashboardProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onNewChat?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  isOpen,
  setIsOpen,
  onNewChat,
}) => {
  const [todayChats, setTodayChats] = useState<ChatEntry[]>([]);
  const [previousChats, setPreviousChats] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Get token from localStorage
  const token = localStorage.getItem("auth_token");
  const isLoggedIn = !!token;

  useEffect(() => {
    // Only fetch chat history if user is logged in and dashboard is open
    if (isLoggedIn && isOpen) {
      fetchChatHistory();
    }
  }, [isLoggedIn, isOpen]);

  const fetchChatHistory = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const chatHistory = await authFetch<ChatMessage[]>("/chat/", token);

      // Process chat history into today and previous
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayEntries: ChatEntry[] = [];
      const previousEntries: ChatEntry[] = [];

      chatHistory.forEach((chat, index) => {
        const chatDate = new Date(chat.timestamp);
        const entry: ChatEntry = {
          id: `chat-${index}`,
          title: chat.question,
          time: chatDate,
        };

        if (chatDate >= today) {
          todayEntries.push(entry);
        } else {
          previousEntries.push(entry);
        }
      });

      setTodayChats(todayEntries);
      setPreviousChats(previousEntries);
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chatEntry: ChatEntry) => {
    // This would be implemented later to load a specific chat
    console.log("Selected chat:", chatEntry);
    // For now, just close the dashboard on mobile
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
        <>
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Today</h3>
            {todayChats.length === 0 ? (
              <p className="text-sm text-gray-400">No chats today</p>
            ) : (
              <ul>
                {todayChats.map((chat) => (
                  <li key={chat.id} className="mb-2">
                    <button
                      onClick={() => handleChatSelect(chat)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded text-left"
                    >
                      <div className="flex items-center">
                        <MessageSquare
                          size={16}
                          className="mr-2 text-gray-500"
                        />
                        <span className="text-sm truncate max-w-[150px]">
                          {chat.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(chat.time, "HH:mm")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Previous Days
            </h3>
            {previousChats.length === 0 ? (
              <p className="text-sm text-gray-400">No previous chats</p>
            ) : (
              <ul>
                {previousChats.map((chat) => (
                  <li key={chat.id} className="mb-2">
                    <button
                      onClick={() => handleChatSelect(chat)}
                      className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded text-left"
                    >
                      <div className="flex items-center">
                        <MessageSquare
                          size={16}
                          className="mr-2 text-gray-500"
                        />
                        <span className="text-sm truncate max-w-[150px]">
                          {chat.title}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(chat.time, "MMM dd")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};
