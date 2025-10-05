import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import channelsApi from "../hooks/hookChannels";
import "./SearchPage.css";
import { useContext } from "react";
import UserContext from "../contexts/userContext";
const SearchPage = () => {
  const { query } = useParams();
  const { user, logout } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    navigate(`/search/${search}`);
  };
  const handleJoin = (channelId) => {
    channelsApi
      .addMember(user.token, channelId, user._id)
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
  };

  // Busca canais quando o parâmetro de busca muda
  useEffect(() => {
    const fetchData = async () => {
      if (query && search) {
        const data = await channelsApi.searchChannels(user.token, query);
        // verificar status 401
        if (data.errorMessage === "Token expirado") {
          alert("Sua sessão expirou. Por favor, faça login novamente.");
          logout();
          navigate("/login");
        }
        setResults(data);
      }
    };
    fetchData();
  }, [query]);

  return (
    <div className="search-page">
      <h1>Pesquisar</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          placeholder="Digite o nome do canal"
          onChange={(e) => setSearch(e.target.value)}
        />
        <input type="submit" value="Procurar" />
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
                    {room.owner.username}
                  </span>
                </p>
              </div>
              <div className="btn-actions">
                {room.members.filter((member) => member === user._id).length >
                0 ? (
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
          <>  
          <p>Nenhum resultado encontrado!</p>
          <p>Apenas canais públicos são exibidos.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
