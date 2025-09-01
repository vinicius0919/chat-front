import { useContext, useState } from "react";
import channelsApi from "../hooks/hookChannels";
import UserContext from "../contexts/userContext";
import { useNavigate } from "react-router-dom";

const FormJoinPrivateRoom = ({ activePrivate, setActivePrivate, setActive }) => {
  const [formData, setFormData] = useState({
    roomName: "",
    type: "public",
    password: null,
  });
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  // function to enter in a private room
  const handleJoinPrivateRoom = (e) => {
    e.preventDefault();
    const { roomName, type, password } = formData;
    if (!roomName) {
      return alert("Por favor, preencha todos os campos.");
    }
    if (type === "private" && !password) {
      return alert("Por favor, preencha a senha.");
    }
    channelsApi.addMemberPrivate(user.token, user._id, roomName, password).then((response) => {
      if (response.errorMessage) {
        return alert(response.errorMessage);
      }
      // Usuário adicionado à sala
      setActivePrivate(false);
      setActive(false);
      navigate(`/chat/${response._id}`);
    }).catch((error) => {
      console.error("Erro ao entrar na sala:", error);
    });
  };
  const handleJoin = (channelId) => {
    channelsApi
      .addMember(user.token, channelId, user._id)
      .then((response) => {
        // Adiciona o usuário à sala
        setActivePrivate(false);
        setActive(false);
        navigate(`/chat/${response._id}`);
      })
      .catch((error) => {
        console.error("Erro ao entrar na sala:", error);
      });
  };
  return (
    <div
      className={`container_form_private ${
        activePrivate ? "active" : "inactive"
      }`}
    >
      <form>
        <label htmlFor="roomName">Nome da sala</label>
        <input
          type="text"
          id="roomName"
          placeholder="Nome da sala"
          value={formData.roomName || ""}
          onChange={(e) =>
            setFormData({ ...formData, roomName: e.target.value })
          }
        />
        <label htmlFor="type">Tipo de sala</label>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="public">Pública</option>
          <option value="private">Privada</option>
        </select>
        {formData.type === "private" && (
          <>
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Senha"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </>
        )}
        <button
          type="submit"
          className="success"
          onClick={ formData.type === "private" ? handleJoinPrivateRoom : handleJoin}
        >
          Entrar
        </button>
        <button
          type="button"
          className="success"
          onClick={() => setActivePrivate(false)}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default FormJoinPrivateRoom;
