import axios from "axios";

const REST_API_BASE_URL='api/mesa';

export const listMesas = () => axios.get(REST_API_BASE_URL);
export const crearMesa=(mesa) => axios.post(REST_API_BASE_URL, mesa);

// Obtener una mesa por ID
export const getMesa = (mesaId) => axios.get(REST_API_BASE_URL + '/' + mesaId);

// Actualizar una mesa por ID
export const updateMesa = (mesaId, mesa) => axios.put(REST_API_BASE_URL + '/' + mesaId, mesa);

// Eliminar una mesa por ID
export const deleteMesa = (mesaId) => axios.delete(REST_API_BASE_URL + '/' + mesaId);