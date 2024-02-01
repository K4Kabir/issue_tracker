import axios from "axios";
import { BaseUrl } from "./baseUrl";
import io from "socket.io-client";

export const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});

const jwtAxios = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

var loader = document.getElementsByClassName("loader_back");
jwtAxios.interceptors.request.use(
  function (config) {
    loader[0].style.display = "block";
    return config;
  },
  function (error) {
    loader[0].style.display = "none";
    return Promise.reject(error);
  }
);

// Add a response interceptor
jwtAxios.interceptors.response.use(
  function (response) {
    loader[0].style.display = "none";
    return response;
  },
  function (error) {
    loader[0].style.display = "none";
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    jwtAxios.defaults.headers.common["Authorization"] = token;
  }
};

export default jwtAxios;
