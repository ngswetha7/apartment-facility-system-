import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/residents",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const fetchResidents = () => API.get("/");

export const promoteResident = (id) =>
  API.put(`/${id}/promote`);

export const depromoteResident = (id) =>
  API.put(`/${id}/depromote`);
