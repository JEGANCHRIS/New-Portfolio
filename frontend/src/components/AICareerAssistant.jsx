import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTimes, FaComments, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import './AICareerAssistant.css';
import { apiUrl } from '../config/api';

const AICareerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);

  const API_BASE_URL = apiUrl('/api/ai-chat');

  // Load suggestions on mount
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/suggestions`);
      setSuggestions(response.data.suggestions);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: messageText.trim(),
        conversationHistory: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        sources: response.data.sources,
        fallback: response.data.fallback
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or contact Meshach directly at jmchristo.2000@gmail.com',
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      // Welcome message
      setMessages([{
        id: 1,
        role: 'assistant',
        content: "👋 Hi! I'm Meshach's AI Career Assistant. Ask me anything about his skills, projects, experience, or availability!",
        isWelcome: true
      }]);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className={`ai-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {isOpen ? <FaTimes size={24} /> : <FaRobot size={24} />}
        {!isOpen && (
          <motion.span
            className="chat-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            Ask AI
          </motion.span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Chat Header */}
            <div className="ai-chat-header">
              <div className="ai-chat-title">
                <FaRobot className="header-icon" />
                <div>
                  <h3>Meshach's AI Assistant</h3>
                  <span className="status-indicator">
                    <span className="status-dot"></span>
                    {isLoading ? 'Thinking...' : 'Online'}
                  </span>
                </div>
              </div>
              <button className="close-chat" onClick={toggleChat}>
                <FaTimes />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="ai-chat-messages">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`message ${message.role} ${message.isWelcome ? 'welcome' : ''} ${message.error ? 'error' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="message-avatar">
                    {message.role === 'assistant' ? <FaRobot /> : <FaComments />}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{message.content}</div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="message-sources">
                        <small>Sources:</small>
                        {message.sources.slice(0, 3).map((source, idx) => (
                          <span key={idx} className="source-tag">
                            {source.title}
                          </span>
                        ))}
                      </div>
                    )}
                    {message.fallback && (
                      <div className="fallback-notice">
                        <small>⚠️ Ollama server not running. Using fallback response.</small>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  className="message assistant loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <FaSpinner className="spinner" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {!isLoading && messages.length < 3 && suggestions.length > 0 && (
              <div className="ai-chat-suggestions">
                <small>Try asking:</small>
                <div className="suggestion-buttons">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(suggestion)}
                      className="suggestion-btn"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="ai-chat-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Meshach's skills, projects, or availability..."
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AICareerAssistant;
