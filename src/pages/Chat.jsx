import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import "./Chat.css";

const Chat = ({ user, setBack }) => {
  const { roomId } = useParams(); // pega da URL
  const [message, setMessage] = useState({ message: "" });
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && user) {
      const data = {
        ...message,
        username: user.username,
        time: new Date().toLocaleTimeString(),
        channel: roomId,
      };

      socket.emit("send_message_to_channel", roomId, data);
      setMessage({ message: "" });
    }
  };

  useEffect(() => {
    setBack(true);
  }, [setBack]);

  useEffect(() => {
    if (!roomId) return;

    // Limpa listeners antes de adicionar novos
    socket.off("room_messages");
    socket.off("message");

    socket.emit("join_channel", roomId);

    const handleRoomMessages = (msgs) => {
      if (msgs && msgs.messages) {
        setMessages(msgs.messages);
      }
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("error", (error) => {
      console.error("Erro ao entrar na sala:", error);
      navigate("/");
    });

    socket.on("room_messages", handleRoomMessages);
    socket.on("message", handleMessage);

    return () => {
      socket.off("room_messages", handleRoomMessages);
      socket.off("message", handleMessage);
    };
  }, [roomId, navigate]);

  // Scroll automático
  useEffect(() => {
    const messagesContainer = document.querySelector(".messages_container");
    if (messagesContainer) {
      messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
    }
  }, [messages]);

  return (
    <div className="chat_container">
      <div className="messages_container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.username === user.username ? "self" : "other"
            }`}
          >
            <span className="user">{msg.username}</span>
            {msg.message}
            <span className="time">{msg.time.slice(0, 5)}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          name="message"
          className="message"
          placeholder="Digite sua mensagem"
          value={message.message}
          onChange={(e) => setMessage({ ...message, message: e.target.value })}
        />
        <input type="submit" value="Enviar" className="submit-message" />
      </form>
    </div>
  );
};

export default Chat;
