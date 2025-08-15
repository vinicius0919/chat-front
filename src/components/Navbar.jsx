import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <h1>Chat App</h1>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
