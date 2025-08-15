import { NavLink, useNavigate } from "react-router-dom";

const Register = ({ user, setUser}) => {
        const navigate = useNavigate();
  const handleRegister = (e) => {
    e.preventDefault();
    setUser({
      username: e.target.username.value,
      password: e.target.password.value,
    });

    navigate("/login"); // Redirect to login after registration
  };

  return (
    <div>
      <h2>Registro</h2>
      <p>Por favor, preencha os campos abaixo para se registrar.</p>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Digite seu nome de usuário"
        />
        <input type="password" name="password" placeholder="Digite sua senha" />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirme sua senha"
        />
        <input type="submit" value="Registrar" />
      </form>
        <p>
            Já tem uma conta? <NavLink to="/login">Faça login</NavLink>
        </p>
    </div>
  );
};

export default Register;
