import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ socket, user, setRoom }) => {
  const navigate = useNavigate();
  const [newRoom, setNewRoom] = useState("");
  const [roomLength, setRoomLength] = useState(0);
  const [rooms, setRooms] = useState([]);

  const handleCreate = (e) => {
    e.preventDefault();

    if (!newRoom.trim()) return alert("Digite um nome para a sala.");
    if (roomLength <= 0) return alert("O tamanho da sala deve ser maior que 0.");

    if (rooms.some(r => r.name.toLowerCase() === newRoom.toLowerCase())) {
      return alert("Já existe uma sala com esse nome!");
    }

    socket.emit("create_channel", newRoom, roomLength, user.username);
    console.log("User created room:", newRoom);

    // Limpa o formulário
    setNewRoom("");
    setRoomLength(0);
  };

  const handleDeleteRoom = (room) => {
    socket.emit("delete_channel", room, user.username);
    console.log("User deleted room:", room);
  };

  const handleJoin = (room) => {
    socket.emit("join_channel", room);
    console.log("User joined room:", room);
    setRoom(room);
    navigate("/chat");
  };

  useEffect(() => {

    socket.emit("get_rooms");


    const handleRoomMessages = (data) => {
      console.log("Received room messages:", data);
      setMessages(data);
    };

    const handleChannelsList = (channels) => {
      setRooms(channels);
      console.log("Available rooms:", channels);
    };

    const handleRooms = (data) => {
      setRooms(data);
      console.log("Available rooms:", data);
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

  return (
    <>
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
                  className="error"
                  onClick={() => handleDeleteRoom(room.name)}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhuma sala disponível no momento.</p>
        )}
      </div>
    </>
  );
};

export default Home;
