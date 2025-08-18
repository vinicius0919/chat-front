const passwordValidation = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: `A senha deve ter pelo menos ${minLength} caracteres.` };
  }
  if (!hasUpperCase) {
    return { isValid: false, message: "A senha deve conter pelo menos uma letra maiúscula." };
  }
  if (!hasLowerCase) {
    return { isValid: false, message: "A senha deve conter pelo menos uma letra minúscula." };
  }
  if (!hasNumber) {
    return { isValid: false, message: "A senha deve conter pelo menos um número." };
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: "A senha deve conter pelo menos um caractere especial." };
  }

  return { isValid: true, message: "Senha válida." };
};

export default passwordValidation;
