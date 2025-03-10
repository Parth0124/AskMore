import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'This is an AI-Based Chatbot.', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const { user } = useAuth();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: input,
      sender: 'user'
    }]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'This is a simulated response from the chatbot.',
        sender: 'bot'
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] ml-64">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start max-w-xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <img
                src={message.sender === 'user' 
                  ? (user?.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80')
                  : 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                alt={message.sender}
                className="h-8 w-8 rounded-full"
              />
              <div className={`mx-2 p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message AskMore..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};