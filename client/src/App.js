import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you?' }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;

    // Add user's message
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setLoading(true);

    // Add typing indicator
    setMessages(prev => [...prev, { sender: 'bot', text: 'typing...' }]);

    try {
      const res = await fetch(`http://localhost:5000/api/answer?q=${encodeURIComponent(question)}`);
      const data = await res.json();

      // Wait 5 seconds before replacing typing with actual answer
      setTimeout(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'bot', text: data.answer || "No answer found." };
          return updated;
        });
        setLoading(false);
      }, 5000);
    } catch (err) {
      setTimeout(() => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'bot', text: 'Error fetching answer.' };
          return updated;
        });
        setLoading(false);
      }, 5000);
    }

    setQuestion('');
  };

  return (
    <div className="app-container">
      <h1 className="title"><span>💬</span> HealthTalk</h1>
      <p className="tagline">Let’s talk about health</p>

      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}
          >
            {msg.text === 'typing...' ? (
              <div className="typing-dots">
                <span></span><span></span><span></span>
              </div>
            ) : msg.text}
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAsk()}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? '...' : <FaPaperPlane />}
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        Developed by <strong>Rintu Roy</strong>
      </footer>
    </div>
  );
}

export default App;
