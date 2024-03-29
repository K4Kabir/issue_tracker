import { createContext, useEffect, useState } from "react";
import jwtAxios from "../jwtAxios/jwtAxios";
import { setAuthToken } from "../jwtAxios/jwtAxios";

export const User = createContext();
const theme = JSON.parse(localStorage.getItem("theme"));

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(theme);
  const [userOnline, setUserOnline] = useState([]);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (JSON.parse(localTheme) == null) {
      localStorage.setItem("theme", true);
      setDark(true);
    }
  }, []);

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      getUserDetails();
    } else {
      // logout
    }
  }, []);

  const SignIn = async (data) => {
    let response = await jwtAxios.post("/User/login", data);
    if (response.data.success) {
      localStorage.setItem("token", response.data.message);
      setAuthToken(response.data.token);
    }
    return response;
  };

  const getUserDetails = async () => {
    try {
      let response = await jwtAxios.get("/User/getUserProfile");
      if (response.data.success) {
        setUser(response.data.message);
      } else {
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  const Logout = async () => {
    let response = await jwtAxios.post("/User/logout", {
      username: user?.username,
    });
    if (response.data.success) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <User.Provider
      value={{
        SignIn,
        Logout,
        getUserDetails,
        user,
        dark,
        setDark,
        userOnline,
        setUserOnline,
      }}
    >
      {children}
    </User.Provider>
  );
};

export default UserContext;
