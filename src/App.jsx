import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
// Replace with your actual Gemini API key

const App = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hi! I'm Gemini AI. Ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          API_KEY,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: input }],
            },
          ],
        }
      );

      const botText =
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I didn't understand that.";

      setMessages((prev) => [...prev, { type: "bot", text: botText }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Error talking to Gemini API 😔" },
      ]);
      console.error(error);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h2 className="chat-title">Gemini Chatbot 💬</h2>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === "user" ? "user" : "bot"}`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="message bot">Typing...</div>}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;
