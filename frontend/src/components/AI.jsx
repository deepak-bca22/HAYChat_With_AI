import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { GEMINI_API_KEY } from '../config';
import './ChatBot.css';

const predefinedAnswers = {
    "hi": "Hello! How can I assist you today?",
    "how are you": "I'm just a program, but thanks for asking! How can I help you?",
    "what can you do": "I can answer questions, provide information, and assist with various tasks. Just ask!",
    "what is your purpose": "My purpose is to assist you with your queries and provide helpful information.",
    "tell me a joke": "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "what is ai": "AI, or Artificial Intelligence, refers to the simulation of human intelligence in machines that are programmed to think and learn like humans.",
    "hello": "Hello! How can I assist you today?",
  "who developed you": "I was developed by Deepak Kumar Dubey using React and Gemini AI API.",
  "give me your introduction": "I am an AI chatbot created to assist users intelligently. I use Google's Gemini API to respond.",
  "what is your name": "I am AssistMe, your AI-powered chatbot assistant.",
  "hello": "Hello there! How can I assist you today?",
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    const question = input.toLowerCase().trim();

    if (predefinedAnswers[question]) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: predefinedAnswers[question] }]);
        setTyping(false);
      }, 500);
    } else {
      try {
   const response = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [{ text: question }]
      }
    ]
  },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
);


        const botReply = response.data.candidates[0]?.content?.parts[0]?.text || "Sorry, I couldn't find a good answer.";
        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      } catch (error) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'Oops! There was an error contacting Gemini AI.' }]);
      }
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-header">HAY AI</div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {typing && <div className="message bot">Typing...</div>}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
