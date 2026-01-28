import axios from "axios";
import router from "../router"; // ajusta la ruta según tu proyecto

const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token"); // eliminar token
      router.push("/login"); // redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;