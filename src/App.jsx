import "./App.css";
import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import socket from "./socket";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import SearchPage from "./pages/SearchPages";
import UserContext from "./contexts/userContext";
import Profile from "./pages/Profile";

export default function App() {
  const [back, setBack] = useState(false);

  const { user } = useContext(UserContext);

  return (
    <BrowserRouter>
      <div className="chat-container">
        <Navbar back={back} />
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Home socket={socket} setBack={setBack} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login setBack={setBack} />}
          />
          <Route
            path="/chat/:roomId"
            element={
              !user ? <Navigate to="/login" /> : <Chat setBack={setBack} />
            }
          />
          <Route
            path="/search/:query"
            element={!user ? <Navigate to="/login" /> : <SearchPage />}
          />
          <Route
            path="/register"
            element={
              user ? <Navigate to="/" /> : <Register setBack={setBack} />
            }
          />
        </Routes>
      </div>
      <footer>
        <p>
          {new Date().getFullYear()} Acai Talk - Todos os direitos reservados
        </p>
      </footer>
    </BrowserRouter>
  );
}
