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
    type: "public",
    password: null,
  });

  // function to enter in a private room
  const handleJoinPrivateRoom = (e) => {
    e.preventDefault();
    const { roomName, type, password } = formData;
    if (!roomName) {
      return alert("Por favor, preencha todos os campos.");
    }
    socket.emit("join_private_channel", roomName, type, password, user._id);
    socket.emit("get_rooms", user._id);
  };

  return (
    <nav>
      {back && (
        <NavLink to="/" className="chat-link">
          <button>Voltar</button>
        </NavLink>
      )}
      <h1 className="title">AçaíTalk</h1>
      {user && (
        <button className="menu-button" onClick={() => setActive(!active)}>
          <FcMenu />
        </button>
      )}

      <div className={`menu ${active ? "active" : "inactive"}`}>
        <ul>
          <li onClick={() => setActivePrivate(!activePrivate)}>
            Adicionar sala
          </li>
          <li
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("currentRoom");
              setActive(false);
              setUser(null);
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
          <label htmlFor="type">Tipo de sala</label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="public">Pública</option>
            <option value="private">Privada</option>
          </select>
          {formData.type === "private" && (
            <>
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
            </>
          )}
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
