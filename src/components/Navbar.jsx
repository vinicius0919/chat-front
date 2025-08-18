import "./Navbar.css";
import socket from "../socket";
import { NavLink } from "react-router-dom";
import { FcMenu } from "react-icons/fc";
import { useEffect, useState } from "react";

const Navbar = ({ user, setUser, setRoom, back }) => {
  const [active, setActive] = useState(false);
  const [activePrivate, setActivePrivate] = useState(false);
  const [formData, setFormData] = useState({
    roomName: "",
    password: "",
  });

  // function to enter in a private room
  const handleJoinPrivateRoom = (e) => {
    e.preventDefault();
    const { roomName, password } = formData;
    if (!roomName || !password) {
      return alert("Por favor, preencha todos os campos.");
    }
    socket.emit("join_private_channel", roomName, password, user.username);
    socket.emit("get_rooms", user.username);
  };

  return (
    <nav>
      {back && (
        <NavLink to="/" className="chat-link">
          <button>Voltar</button>
        </NavLink>
      )}
      <h1>AçaíTalk</h1>
      {user.token && (
        <button className="menu-button" onClick={() => setActive(!active)}>
          <FcMenu />
        </button>
      )}

      <div className={`menu ${active ? "active" : "inactive"}`}>
        <ul>
          <li onClick={() => setActivePrivate(!activePrivate)}>
            Adicionar sala privada
          </li>
          <li
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("currentRoom");
              setActive(false);
              setUser({ username: null, password: null });
              setRoom("");
            }}
          >
            Sair
          </li>
        </ul>
      </div>

      <div
        className={`container_form_private ${
          activePrivate ? "active" : "inactive"
        }`}
      >
        <form>
          <label htmlFor="roomName">Nome da sala</label>
          <input
            type="text"
            id="roomName"
            placeholder="Nome da sala"
            value={formData.roomName}
            onChange={(e) =>
              setFormData({ ...formData, roomName: e.target.value })
            }
          />
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="success"
            onClick={handleJoinPrivateRoom}
          >
            Entrar
          </button>
          <button
            type="button"
            className="success"
            onClick={() => setActivePrivate(false)}
          >
            Cancelar
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
