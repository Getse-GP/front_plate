import axios from "axios";

const USUARIO_API_URL = "api/usuario"; // base

// Login de usuario
export const loginUsuario = (username, password) => {
  return axios.post(`${USUARIO_API_URL}/login`, { username, password })
    .then(response => response.data); // devuelve { username, perfil } si es correcto
};

