const url = import.meta.env.VITE_LOCAL_URL; // URL do servidor

const channelsApi = {
    searchChannels: async (query) => {
        const response = await fetch(`${url}/api/channels/search?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    },
    addMember: async (channelId, userId) => {
        const response = await fetch(`${url}/api/channels/${channelId}/addMember`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });
        return response.json();
    }
};

export default channelsApi;