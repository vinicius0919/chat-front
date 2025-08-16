import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = ({ user, setUser }) => {

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
    const navigate = useNavigate();
      const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      username: formData.username,
      password: formData.password,
    });
    localStorage.setItem("user", JSON.stringify({
      username: formData.username,
      password: formData.password,
    }));
    navigate("/"); // Redirect to home after login
  };
  return (
    <div className="login-container">
    <h2>Login</h2>
    <p>Por favor, preencha os campos abaixo para fazer login.</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Digite seu nome de usuário"
          value={formData.username || ""}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password || ""}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <input type="submit" value="Entrar" />
      </form>
      <p>
        Não tem uma conta? <NavLink to="/register">Registre-se</NavLink>
      </p>
    </div>
  );
};
export default Login;
