import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import socket from "./socket";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { username: null, password: null };
  });
  const [room, setRoom] = useState(() => {
    const savedRoom = localStorage.getItem("currentRoom");
    return savedRoom || "";
  });

  // Salva a sala atual no localStorage
  useEffect(() => {
    if (room) {
      localStorage.setItem("currentRoom", room);
    }
  }, [room]);


  return (
    <BrowserRouter>
      <div className="chat-container">
        <header>
          {user.username && (
            <button
              className="logout-button"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("currentRoom");
                setUser({ username: null, password: null });
                setRoom("");
              }}
            >
              Logout
            </button>
          )}
        </header>
        <Routes>
          <Route
            path="/"
            element={
              user.username ? (
                <Home
                  socket={socket}
                  user={user}
                  setRoom={setRoom}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route
            path="/chat"
            element={
              <Chat
              user={user}
                socket={socket}
                room={room}
              />
            }
          />
          <Route
            path="/register"
            element={<Register user={user} setUser={setUser} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
