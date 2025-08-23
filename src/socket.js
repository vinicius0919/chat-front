import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_LOCAL_URL, {
  transports: ["websocket", "polling"], // Use WebSocket and Polling as transports
  autoConnect: true, // Conecta automaticamente
  reconnection: true, // Habilita reconexão automática
  reconnectionDelay: 1000, // Delay de 1 segundo entre tentativas
  reconnectionAttempts: 5, // Máximo de 5 tentativas de reconexão
  timeout: 20000, // Timeout de 20 segundos
});


export default socket;