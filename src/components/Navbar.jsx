import "./Navbar.css";

import { NavLink } from "react-router-dom";

const Navbar = ({user, setUser, setRoom}) => {
  return (
        <nav  >
          <h1>AçaíTalk</h1>
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
        </nav>
  );
};

export default Navbar;
