import { io } from "socket.io-client";

const socket = io("https://endless-properly-unicorn.ngrok-free.app", {
  transports: ["websocket", "polling"], // Use WebSocket and Polling as transports
  autoConnect: true, // Conecta automaticamente
  reconnection: true, // Habilita reconexão automática
  reconnectionDelay: 1000, // Delay de 1 segundo entre tentativas
  reconnectionAttempts: 5, // Máximo de 5 tentativas de reconexão
  timeout: 20000, // Timeout de 20 segundos
});

// Log de eventos de conexão para debug
socket.on("connect", () => {
  console.log("Socket conectado:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Socket desconectado:", reason);
});

socket.on("reconnect", () => {
  console.log("Socket reconectado");
});

socket.on("reconnect_error", (error) => {
  console.log("Erro na reconexão:", error);
});

export default socket;