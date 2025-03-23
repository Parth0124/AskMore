import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Menu, MessageSquare, PlusCircle } from "lucide-react";

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
  const chats = {
    today: [
      { id: 1, title: "How to be a better person?", time: new Date() },
      { id: 2, title: "Help me with web development", time: new Date() },
    ],
    previous: [
      {
        id: 3,
        title: "React NextJS Tutorial",
        time: new Date(Date.now() - 86400000),
      },
      {
        id: 4,
        title: "Mobile development with golang",
        time: new Date(Date.now() - 172800000),
      },
    ],
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
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Today</h3>
        <ul>
          {chats.today.map((chat) => (
            <li key={chat.id} className="mb-2">
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
              >
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm truncate max-w-[150px]">
                    {chat.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(chat.time, "HH:mm")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Previous Days
        </h3>
        <ul>
          {chats.previous.map((chat) => (
            <li key={chat.id} className="mb-2">
              <a
                href="#"
                className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
              >
                <div className="flex items-center">
                  <MessageSquare size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm truncate max-w-[150px]">
                    {chat.title}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {format(chat.time, "MMM dd")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
