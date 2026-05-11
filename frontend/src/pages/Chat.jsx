// src/pages/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected]           = useState(null); // selected user object
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const bottomRef = useRef(null);

  // Get current logged in user id
  const getMyId = () => {
    try {
      const stored = localStorage.getItem("swapnsaveUser");
      return stored ? JSON.parse(stored)?.user?._id : null;
    } catch { return null; }
  };
  const myId = getMyId();

  // Redirect if not logged in
  useEffect(() => {
    if (!myId) navigate("/login");
  }, []);

  // Load conversation list on mount
  useEffect(() => {
    API.get("/messages/conversations")
      .then(({ data }) => setConversations(data.conversations))
      .catch(console.error);
  }, []);

  // Load messages when a conversation is selected
  const handleSelect = async (conv) => {
    setSelected(conv.user);
    setLoading(true);
    try {
      const { data } = await API.get(`/messages/${conv.user._id}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSend = async () => {
    if (!input.trim() || !selected) return;
    try {
      const { data } = await API.post(`/messages/${selected._id}`, { text: input });
      setMessages((prev) => [...prev, data.message]);
      setInput("");
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  // Send on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="row p-4 rounded shadow" style={{ background: "linear-gradient(to bottom, #C7B8EA, #87CEEB)", minHeight: "500px" }}>

      {/* Left Panel — Conversation List */}
      <div className="col-md-4 border-end">
        <h5 className="mb-3">💬 Conversations</h5>
        {conversations.length === 0 ? (
          <p className="text-muted">No conversations yet.</p>
        ) : (
          <ul className="list-group">
            {conversations.map((conv, i) => (
              <li
                key={i}
                className={`list-group-item ${selected?._id === conv.user._id ? "active" : ""}`}
                onClick={() => handleSelect(conv)}
                style={{ cursor: "pointer" }}
              >
                <strong>{conv.user.name}</strong>
                <br />
                <small className="text-truncate d-block">{conv.lastMessage}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right Panel — Messages */}
      <div className="col-md-8">
        {selected ? (
          <>
            <h5 className="mb-3">Chat with {selected.name}</h5>

            {/* Messages Window */}
            <div className="border rounded p-3 mb-3 bg-white"
              style={{ height: "350px", overflowY: "auto" }}>
              {loading && <p>Loading messages...</p>}
              {messages.map((m, i) => {
                const isMe = m.sender._id === myId || m.sender === myId;
                return (
                  <div key={i} className={`d-flex mb-2 ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                    <div
                      className="px-3 py-2 rounded"
                      style={{
                        background: isMe ? "#0d6efd" : "#e9ecef",
                        color: isMe ? "#fff" : "#000",
                        maxWidth: "70%",
                      }}
                    >
                      <small className="d-block fw-bold mb-1">{isMe ? "You" : m.sender.name}</small>
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="d-flex">
              <input
                className="form-control me-2"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
              />
              <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100">
            <p className="text-muted">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;