import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/userContext";
import userAuth from "../hooks/hookUserAuth";
//import socket from "../socket";

const Home = ({ socket, setBack }) => {
  const navigate = useNavigate();

  const { user, logout } = useContext(UserContext);

  const [toggle, setToggle] = useState(false);
  const [newRoom, setNewRoom] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomLength, setRoomLength] = useState(2);
  const [roomType, setRoomType] = useState("public");
  const [roomPassword, setRoomPassword] = useState("");
  const [rooms, setRooms] = useState([]);

  const handleCreate = (e) => {
    e.preventDefault();

    if (!newRoom.trim()) return alert("Digite um nome para a sala.");
    if (roomLength <= 0)
      return alert("O tamanho da sala deve ser maior que 0.");

    if (rooms.some((r) => r.name.toLowerCase() === newRoom.toLowerCase())) {
      return alert("Já existe uma sala com esse nome!");
    }
    socket.emit(
      "create_channel",
      user.token,
      user._id,
      newRoom,
      roomDescription,
      roomLength,
      roomType,
      roomPassword
    );

    // Limpa o formulário
    setNewRoom("");
    setRoomLength(2);
    setRoomType("public");
    setRoomPassword("");
  };

  const handleDeleteRoom = (roomId) => {
    socket.emit("delete_channel", user.token, roomId);
  };

  const handleJoin = (room) => {
    navigate(`/chat/${room}`);
  };

  useEffect(() => {
    if (user) {
      socket.emit("get_rooms", user.token);
      const addRoom = (room) => {
        setRooms((prevRooms) => [...prevRooms, room]);
      };
      const removeRoom = (room) => {
        setRooms((prevRooms) => prevRooms.filter((r) => r._id !== room._id));
      };

      const handleRoomMessages = (data) => {
        setMessages(data);
      };

      const handleRooms = (data) => {
        setRooms(data);
      };

      socket.on("token_error", async (err) => {
        // O token expirou, tentar fazer refresh
        await userAuth.refreshToken().then((res) => {
          console.log(res);
          localStorage.setItem("user", JSON.stringify({ token: res.accessToken }));
          console.log("Token atualizado com sucesso - Home");
        }).catch((error) => {
          console.log("Refresh token inválido ou expirado - Home");
          logout();
        });
      });
      socket.on("channel_created", addRoom);
      socket.on("channel_deleted", removeRoom);
      socket.on("room_messages", handleRoomMessages);
      socket.on("rooms", handleRooms);

      return () => {
        socket.off("channel_created", addRoom);
        socket.off("channel_deleted", removeRoom);
        socket.off("room_messages", handleRoomMessages);
        socket.off("rooms", handleRooms);
      };
    }
  }, [socket]);

  useEffect(() => {
    setBack(false);
  }, []);

  return (
    <>
      <div className="form-container">
        <p>Crie uma nova sala de bate-papo ou entre em uma sala existente!</p>
        <form onSubmit={handleCreate} className="create-room-form">
          <label htmlFor="room">Nome da sala:</label>
          <input
            type="text"
            name="room"
            id="room"
            placeholder="Digite o nome da sala"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value.trim())}
            required
          />
          <label htmlFor="room_description">Descrição da sala:</label>
          <input
            type="text"
            name="room_description"
            id="room_description"
            placeholder="Digite a descrição da sala"
            value={roomDescription}
            onChange={(e) => setRoomDescription(e.target.value.trim())}
            required
          />

          <label htmlFor="room_type">Tipo de sala:</label>
          <select
            name="room_type"
            id="room_type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="public">Pública</option>
            <option value="private">Privada</option>
          </select>

          {roomType === "private" && (
            <>
              <label htmlFor="room_password">Senha da sala:</label>
              <input
                type={toggle ? "text" : "password"}
                name="room_password"
                placeholder="Digite a senha da sala"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value.trim())}
                required
              />
              <div className="toggle-password">
                <input
                  type="checkbox"
                  name="see_room_password"
                  id="see_room_password"
                  onChange={() => setToggle(!toggle)}
                />
                <label htmlFor="see_room_password">Ver senha</label>
              </div>
            </>
          )}

          <label htmlFor="room_length">Máximo de participantes:</label>
          <input
            type="number"
            name="room_length"
            placeholder="Digite o tamanho da sala"
            value={roomLength}
            onChange={(e) => setRoomLength(Number(e.target.value.trim()))}
            required
            min="1"
          />
          <input type="submit" value="Criar" />
        </form>
      </div>

      <div className="rooms">
        {rooms.length > 0 ? (
          rooms.map((room, index) => (
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
                <button
                  className="success"
                  onClick={() => handleJoin(room._id)}
                >
                  Entrar
                </button>
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
          <p>Nenhuma sala disponível no momento. Crie uma nova sala!</p>
        )}
      </div>
    </>
  );
};

export default Home;
