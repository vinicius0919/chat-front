const serverUrl = `${import.meta.env.VITE_SERVER_URL}/api/users`;

const userAuth = {
  login: async (username, password) => {
    const response = await fetch(`${serverUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // garante que refresh token vá para o cookie
    });

    if (!response.ok) throw new Error("Falha no login");
    const data = await response.json();
    // console cookies
    console.log(data.cookies);
    //localStorage.setItem('user', JSON.stringify({ token: data.accessToken }));
    return data;
  },

  register: async (username, password) => {
    const response = await fetch(`${serverUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Falha no registro");
    return response.json();
  },

  updateUser: async (userId, userData) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    const response = await fetch(`${serverUrl}/update/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      cookies: 'include',
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    if (response.status === 403 || response.status === 401) {
      // access token expirou → tenta renovar
      newToken = await userAuth.refreshToken().acessToken;
      localStorage.setItem('user', JSON.stringify({ token: newToken }));
      return userAuth.updateUser(userId, userData); // tenta de novo
    }

    return response.json();
  },

  refreshToken: async () => {
    const response = await fetch(`${serverUrl}/refresh`, {
      method: 'POST',
      credentials: 'include', // refresh token vem do cookie
    });

    if (!response.ok) throw new Error("Refresh token inválido ou expirado");

    const data = await response.json();
    //localStorage.setItem('user', JSON.stringify({ token: data.accessToken }));
    return data;
  },

  logout: async () => {
    await fetch(`${serverUrl}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.removeItem('user');
  }
};

export default userAuth;
