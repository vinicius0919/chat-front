import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userAuth from "../hooks/hookUserAuth";
import UserContext from "../contexts/userContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const { username, password } = formData;
    if (!username || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const response = await userAuth.login(username, password);
    if (response.errorMessage) {
      console.error("Login failed:", response.errorMessage);
      setError(response.errorMessage);
    } else {
      setUser({
        username: username,
        token: response.token,
        _id: response.userId,
        profileImage: response.profileImage || null,
      });
      navigate("/"); // Redirect to home after login
    }
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
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={formData.password || ""}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <input type="submit" value="Entrar" />
      </form>

      {error && (
        <span className="error-message">
          {error || "Essa é uma mensagem de teste"}
        </span>
      )}
      <p>
        Não tem uma conta? <NavLink to="/register">Registre-se</NavLink>
      </p>
    </div>
  );
};
export default Login;
