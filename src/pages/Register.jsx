import { NavLink, useNavigate } from "react-router-dom";
import userAuth from "../hooks/hookUserAuth";
import passwordValidation from "../hooks/hookPassowordValidate";
import { useEffect, useState } from "react";

const Register = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [userRegister, setUserRegister] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValidationResult, setPasswordValidationResult] = useState({
    has8Characters: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialCharacter: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const passwordValidation = (password) => {
    setPasswordValidationResult({
      has8Characters: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialCharacter: /[!@#$%^&*]/.test(password),
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validation = {
      isValid: passwordValidationResult.has8Characters &&
        passwordValidationResult.hasUppercase &&
        passwordValidationResult.hasLowercase &&
        passwordValidationResult.hasNumber &&
        passwordValidationResult.hasSpecialCharacter
    };
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    if (userRegister.password !== userRegister.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    const response = await userAuth.register(
      userRegister.username,
      userRegister.password
    );
    if (response.errorMessage) {
      setError(response.errorMessage);
    } else {
      setSuccess("Registro bem-sucedido! Redirecionando para o login...");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  useEffect(() => {
    passwordValidation(userRegister.password);
  }, [userRegister.password]);

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <p>Por favor, preencha os campos abaixo para se registrar.</p>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Digite seu nome de usuário"
          value={userRegister.username}
          onChange={(e) =>
            setUserRegister({ ...userRegister, username: e.target.value })
          }
        />
        <input
          type="password"
          name="password"
          placeholder="Digite sua senha"
          value={userRegister.password}
          onChange={(e) =>
            setUserRegister({ ...userRegister, password: e.target.value })
          }
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirme sua senha"
          value={userRegister.confirmPassword}
          onChange={(e) =>
            setUserRegister({
              ...userRegister,
              confirmPassword: e.target.value,
            })
          }
        />
        <input type="submit" value="Registrar" />
      </form>
      <div className="validations-container">
        <p>A senha deve ter:</p>
        <ul className="validations-list">
          <li
            className={`eight-characters ${
              passwordValidationResult.has8Characters ? "valid" : "invalid"
            }`}
          >
            Ao menos 8 caracteres
          </li>
          <li
            className={`uppercase ${
              passwordValidationResult.hasUppercase ? "valid" : "invalid"
            }`}
          >
            Ao menos uma letra maiúscula
          </li>
          <li
            className={`lowercase ${
              passwordValidationResult.hasLowercase ? "valid" : "invalid"
            }`}
          >
            Ao menos uma letra minúscula
          </li>
          <li
            className={`number ${
              passwordValidationResult.hasNumber ? "valid" : "invalid"
            }`}
          >
            Ao menos um número
          </li>
          <li
            className={`special-character ${
              passwordValidationResult.hasSpecialCharacter ? "valid" : "invalid"
            }`}
          >
            Ao menos um caractere especial (!@#$%^&*)
          </li>
        </ul>
      </div>

      {success && <span className="success-message">{success}</span>}
      {error && <span className="error-message">{error}</span>}
      <p>
        Já tem uma conta? <NavLink to="/login">Faça login</NavLink>
      </p>
    </div>
  );
};

export default Register;
