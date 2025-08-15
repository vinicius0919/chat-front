import { useEffect, useState } from "react";
import socket from "../socket";
import "./Chat.css";

const Chat = ({ user, room }) => {
  const [message, setMessage] = useState({ message: "" });
  const [messages, setMessages] = useState([]);

  // Recupera a sala do localStorage se não foi passada como prop
  const currentRoom = room || localStorage.getItem("currentRoom");

  console.log("Chat component rendered - room:", currentRoom, "user:", user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRoom && user.username) {
      const data = {
        ...message,
        username: user.username,
        time: new Date().toLocaleTimeString(),
        channel: currentRoom,
      };

      console.log("Sending message:", data);
      socket.emit("send_message_to_channel", currentRoom, data);
    }
    setMessage({ message: "" });
  };

  // useEffect para garantir conexão do socket
  useEffect(() => {
    console.log("Verificando conexão do socket...");
    
    if (!socket.connected) {
      console.log("Socket não conectado, tentando conectar...");
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Socket conectado!");
    };

    const handleDisconnect = () => {
      console.log("Socket desconectado!");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    console.log("useEffect executado - currentRoom:", currentRoom, "socket connected:", socket.connected);
    
    if (!currentRoom) {
      console.log("Sem sala definida, saindo do useEffect");
      return;
    }

    // Limpa listeners existentes antes de adicionar novos
    socket.off("room_messages");
    socket.off("message");

    console.log("Entrando na sala:", currentRoom);
    socket.emit("join_channel", currentRoom);
    socket.emit("get_room_messages", currentRoom);

    const handleRoomMessages = (msgs) => {
      console.log("Received room messages:", msgs);
      setMessages(msgs);
    };

    const handleMessage = (msg) => {
      console.log("Received new message:", msg);
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("room_messages", handleRoomMessages);
    socket.on("message", handleMessage);

    return () => {
      console.log("Cleanup: removendo listeners para sala:", currentRoom);
      socket.off("room_messages", handleRoomMessages);
      socket.off("message", handleMessage);
    };
  }, [currentRoom, socket]);


  return (
    <>
      <div className="messages_container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.username === user.username ? 'self' : 'other'}`}>
            <span className="user">{msg.username}</span>{msg.message}
            <span className="time">{msg.time}</span>
          </div>
        ))}
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
