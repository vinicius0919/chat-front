const serverUrl = `${import.meta.env.VITE_LOCAL_URL}/api/users`; // URL do servidor de autenticação

const userAuth = {
  login: async (username, password) => {
    const response = await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },
  register: async (username, password) => {
    const response = await fetch(`${serverUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },
};

export default userAuth;
