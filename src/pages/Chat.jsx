import { useEffect, useState } from "react";
import socket from "../socket";
import "./Chat.css";

const Chat = ({ user, room, setBack }) => {
  const [message, setMessage] = useState({ message: "" });
  const [messages, setMessages] = useState([]);


  // Recupera a sala do localStorage se não foi passada como prop
  const currentRoom = room || localStorage.getItem("currentRoom");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRoom && user) {
      const data = {
        ...message,
        username: user.username,
        time: new Date().toLocaleTimeString(),
        channel: currentRoom,
      };

      socket.emit("send_message_to_channel", currentRoom, data);
    }
    setMessage({ message: "" });
  };
    useEffect(() => {
    setBack(true);
  }, []);


  // useEffect para garantir conexão do socket
  useEffect(() => {

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
    };

    const handleDisconnect = () => {
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {


    if (!currentRoom) {
      return;
    }

    // Limpa listeners existentes antes de adicionar novos
    socket.off("room_messages");
    socket.off("message");

    socket.emit("join_channel", currentRoom);

    const handleRoomMessages = (msgs) => {
      console.log("Mensagens da sala:", msgs);
      setMessages(msgs.messages);
    };

    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("room_messages", handleRoomMessages);
    socket.on("message", handleMessage);

    return () => {
      socket.off("room_messages", handleRoomMessages);
      socket.off("message", handleMessage);
    };
  }, [currentRoom, socket]);

  // scroll para o final do messages container
  useEffect(() => {
    const messagesContainer = document.querySelector(".messages_container");
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
  }, [messages]);

  return (
    <>
      <div className="chat_container">
        <div className="messages_container">
          {messages && messages.map((msg, index) => (
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
            id="message"
            className="message"
            placeholder="Digite sua mensagem"
            value={message.message}
            onChange={(e) =>
              setMessage({ ...message, message: e.target.value })
            }
          />
          <input type="submit" value="Enviar" className="submit-message" />
        </form>
      </div>
    </>
  );
};

export default Chat;
