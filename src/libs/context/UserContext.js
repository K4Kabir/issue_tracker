import { createContext, useEffect, useState } from "react";
import jwtAxios from "../jwtAxios/jwtAxios";
import { setAuthToken } from "../jwtAxios/jwtAxios";

export const User = createContext();

const UserContext = ({ children }) => {
  console.log(children);
  const [user, setUser] = useState(null);

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
      localStorage.setItem("token", response.data.token);
      setAuthToken(response.data.token);
      return response.data.message;
    } else {
      return response.data.message;
    }
  };

  const getUserDetails = async () => {
    let response = await jwtAxios.get("/User/getUserProfile");
    if (response.data.success) {
      setUser(response.data.message);
    } else {
      setUser(null);
    }
  };

  const Logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <User.Provider value={{ SignIn, Logout, getUserDetails, user }}>
      {children}
    </User.Provider>
  );
};

export default UserContext;
