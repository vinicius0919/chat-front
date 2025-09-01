import "./Navbar.css";
import socket from "../socket";
import { NavLink } from "react-router-dom";
import { FcMenu } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/userContext";
import { FaRegUserCircle } from "react-icons/fa";
import FormJoinPrivateRoom from "./FormJoinPrivateRoom";
import FormUserProfile from "./FormUserProfile";

const Navbar = ({ back }) => {
  const { user, setUser } = useContext(UserContext);
  const [active, setActive] = useState(false);
  const [activePrivate, setActivePrivate] = useState(false);

  return (
    <nav>
      {back && (
        <NavLink to="/" className="chat-link">
          <button>Voltar</button>
        </NavLink>
      )}
      <NavLink to="/" className="title">
        AçaíTalk
      </NavLink>
      {user && (
        <button
          className="menu-button"
          onClick={() => {
            setActive(!active);
          }}
        >
          <FcMenu />
        </button>
      )}

      <div className={`menu ${active ? "active" : "inactive"}`}>
        {/* add background div */}
        <div className="background" onClick={() => setActive(false)} />
        <ul>
          <li>
            <NavLink
              to={`/profile`}
              className="chat-link"
              onClick={() => setActive(false)}
            >
              <FaRegUserCircle className="user-profile-icon" />
              Meu Perfil
            </NavLink>
          </li>
                    <li>
            <NavLink
              to={`/`}
              className="chat-link"
              onClick={() => setActive(false)}
            >
              Início
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/search/""`}
              className="chat-link"
              onClick={() => setActive(false)}
            >
              Procurar sala
            </NavLink>
          </li>
          <li onClick={() => setActivePrivate(!activePrivate)}>
            Adicionar sala
          </li>
          <li
            onClick={() => {
              localStorage.removeItem("user");
              localStorage.removeItem("currentRoom");
              setActive(false);
              setUser(null);
            }}
          >
            Sair
          </li>
        </ul>
      </div>

      {/* <FormUserProfile active={active} /> */}
      <FormJoinPrivateRoom
        activePrivate={activePrivate}
        setActivePrivate={setActivePrivate}
        setActive={setActive}
      />
    </nav>
  );
};

export default Navbar;
