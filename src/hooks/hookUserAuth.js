const serverUrl = `${import.meta.env.VITE_SERVER_URL}/api/users`; // URL do servidor de autenticação

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
  updateUser: async (token, userId, userData) => {
    const response = await fetch(`${serverUrl}/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

export default userAuth;
