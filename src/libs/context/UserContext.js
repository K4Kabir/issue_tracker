import { createContext, useEffect, useState } from "react";
import jwtAxios from "../jwtAxios/jwtAxios";
import { setAuthToken } from "../jwtAxios/jwtAxios";

export const User = createContext();

const UserContext = ({ children }) => {
  console.log(children);
  const [user, setUser] = useState(null);
  const [dark, setDark] = useState(true);

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

  const Logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <User.Provider
      value={{ SignIn, Logout, getUserDetails, user, dark, setDark }}
    >
      {children}
    </User.Provider>
  );
};

export default UserContext;
