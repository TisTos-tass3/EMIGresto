// components/ChatBot.jsx
import axios from "axios";
import { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour ! Pose-moi une question sur EMIG Resto." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { from: "user", text: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    try {
      const resp = await axios.post("/api/chat/", { message: input });
      setMessages((m) => [...m, { from: "bot", text: resp.data.reply }]);
    } catch {
      setMessages((m) => [...m, { from: "bot", text: "Erreur du serveur." }]);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-md mx-auto">
      <div className="h-64 overflow-y-auto mb-4 border p-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${m.from === "bot" ? "text-left" : "text-right"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                m.from === "bot" ? "bg-gray-200" : "bg-blue-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
