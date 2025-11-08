const url = import.meta.env.VITE_SERVER_URL; // URL do servidor

const channelsApi = {
  // (name, description, ownerId, configs)
  createChannel: async (token, name, description, ownerId, configs) => {
    console.log("Criando canal com configs:", configs);
    const response = await fetch(`${url}/api/channels/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, ownerId, configs }),
    });
    return response.json();
  },
  deleteChannel: async (token, channelId, ownerId) => {
    const response = await fetch(`${url}/api/channels/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ channelId, ownerId }),
    });
    return response;
  },

  searchChannels: async (token, query) => {
    const response = await fetch(
      `${url}/api/channels/search?query=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.json();
  },
  addMember: async (token, channelId, userId) => {
    const response = await fetch(`${url}/api/channels/${channelId}/addMember`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  },
  addMemberPrivate: async (token, userId, channelName, password) => {
    const response = await fetch(
      `${url}/api/channels/${channelName}/addMemberPrivate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, channelPassword: password }),
      }
    );
    return response.json();
  },
  getChannelsByUserId: async (token, userId) => {
    const response = await fetch(`${url}/api/channels/user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },
};

export default channelsApi;
