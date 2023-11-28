import axios from "axios";
import { BaseUrl } from "./baseUrl";

const jwtAxios = axios.create({
  baseURL: BaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    jwtAxios.defaults.headers.common["Authorization"] = token;
  }
};

export default jwtAxios;
