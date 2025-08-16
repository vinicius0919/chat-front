import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ socket, user, setRoom, setBack }) => {
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState("");
  const [roomLength, setRoomLength] = useState(0);
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
      newRoom,
      roomLength,
      user.username,
      roomType,
      roomPassword
    );

    // Limpa o formulário
    setNewRoom("");
    setRoomLength(0);
    setRoomType("public");
    setRoomPassword("");
  };

  const handleDeleteRoom = (room) => {
    socket.emit("delete_channel", room, user.username);
  };

  const handleJoin = (room) => {
    socket.emit("join_channel", room);
    setRoom(room);
    navigate("/chat");
  };

  useEffect(() => {
    socket.emit("get_rooms", user.username);

    const handleRoomMessages = (data) => {
      setMessages(data);
    };

    const handleChannelsList = (channels) => {
      setRooms(channels);
    };

    const handleRooms = (data) => {
      setRooms(data);
    };

    socket.on("room_messages", handleRoomMessages);
    socket.on("channels_list", handleChannelsList);
    socket.on("rooms", handleRooms);

    return () => {
      socket.off("room_messages", handleRoomMessages);
      socket.off("channels_list", handleChannelsList);
      socket.off("rooms", handleRooms);
    };
  }, [socket]);

  useEffect(() => {
    setBack(false);
  }, []);

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleCreate} className="create-room-form">
          <label htmlFor="room">Nome da sala:</label>
          <input
            type="text"
            name="room"
            placeholder="Digite o nome da sala"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
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
                type="password"
                name="room_password"
                placeholder="Digite a senha da sala"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                required
              />
            </>
          )}

          <label htmlFor="room_length">Máximo de participantes:</label>
          <input
            type="number"
            name="room_length"
            placeholder="Digite o tamanho da sala"
            value={roomLength}
            onChange={(e) => setRoomLength(Number(e.target.value))}
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
              <span className="room-name">{room.name}</span>
              <div className="btn-actions">
                <button
                  className="success"
                  onClick={() => handleJoin(room.name)}
                >
                  Entrar
                </button>
                <button
                  className="sucess"
                  onClick={() => handleDeleteRoom(room.name)}
                >
                  Deletar
                </button>
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
