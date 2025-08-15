import { NavLink, useNavigate } from "react-router-dom";

const Login = ({ user, setUser }) => {
    const navigate = useNavigate();
      const handleLogin = (e) => {
    e.preventDefault();
    setUser({
      username: e.target.username.value,
      password: e.target.password.value,
    });
    localStorage.setItem("user", JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value,
    }));
    navigate("/"); // Redirect to home after login
  };
  return (
    <>
    <h2>Login</h2>
    <p>Por favor, preencha os campos abaixo para fazer login.</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Digite seu nome de usuário"
          value={user.username || ""}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={user.password || ""}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
        <input type="submit" value="Entrar" />
      </form>
      <p>
        Não tem uma conta? <NavLink to="/register">Registre-se</NavLink>
      </p>
    </>
  );
};
export default Login;
