import { NavLink, useNavigate } from "react-router-dom";
import userAuth from "../hooks/hookUserAuth";
import passwordValidation from "../hooks/hookPassowordValidate";
import { useState } from "react";

const Register = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    const password = e.target.password.value;
    const confirmPassword = e.target.confirm_password.value;
    const email = e.target.username.value;
    const validation = passwordValidation(password);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const response = await userAuth.register(email, password);
    if (response.errorMessage) {
      setError(response.errorMessage);
    } else {
      setSuccess("Registro bem-sucedido! Redirecionando para o login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="register-container">
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
      {success && <span className="success-message">{success}</span>}
      {error && <span className="error-message">{error}</span>}
      <p>
        Já tem uma conta? <NavLink to="/login">Faça login</NavLink>
      </p>
    </div>
  );
};

export default Register;
