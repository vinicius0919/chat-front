import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket";
import "./Chat.css";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
import User from "../assets/user.png";
import profileAssets from "../hooks/hookProfileAssets";

const Chat = ({ setBack }) => {
  const { roomId } = useParams(); // pega da URL
  const { user } = useContext(UserContext);
  const [usersInfo, setUsersInfo] = useState([]);
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
      };

      socket.emit("send_message_to_channel", user.token, roomId, data);
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

    socket.emit("join_channel", user.token, roomId);

    const handleRoomMessages = (msgs, members) => {
      if (msgs && msgs.messages && members) {
        setMessages(msgs.messages);
        setUsersInfo(members);
      }
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("channel_error", (error) => {
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
        {messages.map((msg, index) => {
          if (!msg.username)
            return (
              <div key={index} className="system-message">
                {msg.message}
              </div>
            );

          return (
            <div
              key={index}
              className={`message ${
                msg.username === user.username ? "self" : "other"
              }`}
            >
              <span className="user">
                <img
                  src={
                    // Se o usuário não tiver imagem, usa a padrão
                    // verifica se for o usuário atual
                    usersInfo.filter((u) => u.username === msg.username)
                      .length === 0
                      ? User
                      : profileAssets[
                          usersInfo.filter(
                            (u) => u.username === msg.username
                          )[0].profileImage
                        ]?.src || User
                  }
                  alt="Profile"
                  className="profile-image"
                />
                {msg.username}
              </span>
              {msg.message}
              <span className="time">{msg.time.slice(0, 5)}</span>
            </div>
          );
        })}
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
