import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

export const withToken = (token) => {
  return axios.create({
    baseURL: "http://localhost:4000/api/v1",
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    },
  });
};

export default API;
