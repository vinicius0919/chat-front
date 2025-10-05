import { createContext, useEffect, useState } from "react";
import userAuth from "../hooks/hookUserAuth";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (!JSON.parse(savedUser)?.token) {
      localStorage.removeItem("user");
      return null;
    }
    return JSON.parse(savedUser);
  });

  useEffect(() => {
    if (!user) return;

    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const logout = () => {
    setUser(null);
    userAuth.logout();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
