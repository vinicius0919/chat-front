import "./App.css";
import { useState, useEffect, use } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import socket from "./socket";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

export default function App() {
  const [back, setBack] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { username: null, token: null, _id: null };
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

  useEffect(() => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: user.username,
        token: user.token,
        _id: user._id,
      })
    );
  }, [user]);

  return (
    <BrowserRouter>
      <div className="chat-container">
        <Navbar user={user} setUser={setUser} setRoom={setRoom} back={back} />
        <Routes>
          <Route
            path="/"
            element={
              user.token ? (
                <Home
                  socket={socket}
                  user={user}
                  setRoom={setRoom}
                  setBack={setBack}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              user.token ? (
                <Navigate to="/" />
              ) : (
                <Login user={user} setUser={setUser} setBack={setBack} />
              )
            }
          />
          <Route
            path="/chat"
            element={
              !user.token ? (
                <Navigate to="/login" />
              ) : (
                <Chat
                  user={user}
                  socket={socket}
                  room={room}
                  setBack={setBack}
                />
              )
            }
          />
          <Route
            path="/register"
            element={
              user.token ? (
                <Navigate to="/" />
              ) : (
                <Register user={user} setUser={setUser} setBack={setBack} />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
