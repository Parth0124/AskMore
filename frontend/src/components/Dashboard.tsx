import React, { useState } from 'react';
import { format } from 'date-fns';
import { Menu, MessageSquare } from 'lucide-react';

export const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  const chats = {
    today: [
      { id: 1, title: 'How to be a better person?', time: new Date() },
      { id: 2, title: 'Help me with web development', time: new Date() }
    ],
    previous: [
      { id: 3, title: 'React NextJS Tutorial', time: new Date(Date.now() - 86400000) },
      { id: 4, title: 'Mobile development with golang', time: new Date(Date.now() - 172800000) }
    ]
  };

  return (
    <div className={`bg-white w-64 h-screen fixed left-0 top-16 transform transition-transform duration-200 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-64'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-10 top-4 bg-white p-2 rounded-r-md shadow-md"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Today</h2>
          {chats.today.map(chat => (
            <div key={chat.id} className="mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{chat.title}</span>
              </div>
              <span className="text-xs text-gray-500">{format(chat.time, 'HH:mm')}</span>
            </div>
          ))}
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Previous Days</h2>
          {chats.previous.map(chat => (
            <div key={chat.id} className="mb-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="text-sm truncate">{chat.title}</span>
              </div>
              <span className="text-xs text-gray-500">{format(chat.time, 'MMM dd')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};