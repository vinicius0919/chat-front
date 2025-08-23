import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import channelsApi from "../hooks/hookChannels";
import "./SearchPage.css";
const SearchPage = ({ user }) => {
  const { query } = useParams();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    const data = await channelsApi.searchChannels(search);
    setResults(data);
  };
  const handleJoin = (channelId) => {
    channelsApi
      .addMember(channelId, user._id)
      .then((response) => {
        // Adiciona o usuário à sala
        console.log(response);
        // atualiza a lista de resultados para refletir a mudança
        setResults((prevResults) =>
          prevResults.map((room) =>
            room._id === channelId
              ? { ...room, members: [...room.members, user._id] }
              : room
          )
        );
      })
      .catch((error) => {
        console.error("Erro ao entrar na sala:", error);
      });
  };
  return (
    <div className="search-page">
      <h1>Search Page</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="submit" value={"Search"} />
      </form>
      <div className="rooms">
        {results.length > 0 ? (
          results.map((room, index) => (
            <div key={index} className="room">
              <div className="room-info">
                <span className="room-name">{room.name}</span>
                <p className="room-owner">
                  Criado por:
                  <span className="room-owner-username">
                    {" "}
                    {room.owner.username}
                  </span>
                </p>
              </div>
              <div className="btn-actions">
                {room.members.map((member) => member._id === user._id).length > 0 ? (
                  <NavLink to={`/chat/${room._id}`} className="chat-link">
                    <button className="success">Conversar</button>
                  </NavLink>
                ) : (
                  <button
                    className="success"
                    onClick={() => handleJoin(room._id)}
                  >
                    Entrar
                  </button>
                )}
                {user._id === room.owner._id && (
                  <button
                    className="success"
                    onClick={() => handleDeleteRoom(room._id)}
                  >
                    Deletar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum resultado encontrado!</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
