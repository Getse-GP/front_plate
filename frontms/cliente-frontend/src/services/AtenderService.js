import axios from "axios";
import { getToken } from "./AuthService";


const REST_API_BASE_URL = 'api/atender';


const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});


// Listar todos los registros de Atender
export const listAtender = () => axios.get(REST_API_BASE_URL, authHeader());

// Crear un nuevo registro de Atender
export const crearAtender = (atender) => axios.post(REST_API_BASE_URL, atender, authHeader());

// Obtener un registro de Atender por ID
export const getAtender = (idAtender) =>
  axios.get(`${REST_API_BASE_URL}/${idAtender}`, authHeader());

// Actualizar un registro de Atender
export const updateAtender = (idAtender, atender) =>
  axios.put(`${REST_API_BASE_URL}/${idAtender}`, atender, authHeader());

// Eliminar un registro de Atender
export const deleteAtender = (idAtender) =>
  axios.delete(`${REST_API_BASE_URL}/${idAtender}`, authHeader());