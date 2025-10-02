import "./FormUserProfile.css";
import { useContext, useState } from "react";
import UserContext from "../contexts/userContext";
import { FaUserEdit } from "react-icons/fa";
import profileAssets from "../hooks/hookProfileAssets";
import userAuth from "../hooks/hookUserAuth";
import User from "../assets/user.png";

const FormUserProfile = () => {
  const { user, setUser, logout } = useContext(UserContext);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [inactive, setInactive] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    console.log("Imagem selecionada:", image);
    setSelectedImage(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await userAuth.updateUser(user.token, user._id, {
      profileImage: selectedImage,
    });
    if (res.errorMessage) {

      if (res.errorMessage === "Token expirado") {
        setError("Sua sessão expirou. Faça login novamente.");
        setTimeout(() => {
          setError(null);
          logout();
          // Aqui você pode adicionar lógica para redirecionar o usuário para a página de login, se necessário.
        }, 3000);
        return;
      }

      setError(res.errorMessage);
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    console.log("Resposta da atualização do usuário:", res);
    setUser({ ...user, profileImage: res.user.profileImage });
    setSuccess("Imagem de perfil atualizada com sucesso!");
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // extract the file name from the path
  const getFileName = (filePath) => {
    // remove the extension too
    return filePath.split("/").pop().split(".")[0];
  };

  return (
    <div className={`container-form-user-profile`}>
      <h2>Perfil</h2>
      <form onSubmit={handleSubmit}>
        {(user.profileImage || selectedImage) && (
          <img
            src={
              (selectedImage
                ? profileAssets[selectedImage].src
                : profileAssets[user.profileImage].src) || User
            }
            alt="Profile Image"
            onClick={() => {
              setInactive(false);
            }}
          />
        )}
        {!user.profileImage && !selectedImage && (
          <FaUserEdit
            className="default-profile-icon"
            onClick={() => {
              setInactive(false);
            }}
          />
        )}
        <label htmlFor="username">Nome de usuário</label>
        <input
          type="text"
          id="username"
          placeholder="Nome de usuário"
          value={user ? user.username : ""}
          disabled
        />
        <label htmlFor="password">Senha</label>
        <button type="button" className="secondary">
          Redefinir Senha
        </button>

        <div>
          <input type="checkbox" name="privacity" id="privacity" />
          <label htmlFor="privacity">Tornar meu perfil privado</label>
        </div>
        <input type="submit" className="success" value="Salvar" />
      </form>
      {success && <span className="success-message">{success}</span>}
      {error && <span className="error-message">{error}</span>}

      <div className={`background ${inactive ? "inactive" : ""}`} onClick={() => setInactive(true)}></div>
      <div className={`profile-assets-container ${inactive ? "inactive" : ""}`}>
        <div className="profile-assets">
          {profileAssets.getAll.map((asset, index) => (
            <img
              key={index}
              src={asset.src}
              alt={`Profile Asset ${asset.name}`}
              className={selectedImage === asset.name ? "selected" : ""}
              onClick={() => handleImageSelect(asset.name)}
            />
          ))}
        </div>
        <div>
          <button
            className="success"
            onClick={() => {
              setInactive(true);
            }}
          >
            Definir
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormUserProfile;
