import axios from "axios";

const REST_API_BASE_URL = '/api/reservar';

// Listar todos los registros de Atender
export const listAtender = () => axios.get(REST_API_BASE_URL);

// Listar todas las reservas
export const listReservas = () => axios.get(REST_API_BASE_URL);

// Crear una nueva reserva
export const crearReserva = (reserva) => axios.post(REST_API_BASE_URL, reserva);

// Obtener una reserva por ID
export const getReserva = (idReserva) => axios.get(`${REST_API_BASE_URL}/${idReserva}`);

// Actualizar una reserva por ID
export const updateReserva = (idReserva, reserva) =>
  axios.put(`${REST_API_BASE_URL}/${idReserva}`, reserva);

// Eliminar una reserva por ID
export const deleteReserva = (idReserva) => axios.delete(`${REST_API_BASE_URL}/${idReserva}`);

// Buscar reservas por una fecha exacta
export const buscarReservasPorFecha = (fecha) => axios.get(`${REST_API_BASE_URL}/fecha/${fecha}`);

// Buscar reservas ligadas a un cliente específico (para MisReservacionesComponent)
/**
 * Llama al backend para obtener todas las reservas asociadas a un cliente.
 * * @param {number} clienteId - El ID del cliente autenticado.
 * @returns {Promise} Una promesa con la respuesta de Axios.
 */
export const buscarReservasPorClienteId = (clienteId) => 
  axios.get(`${REST_API_BASE_URL}/cliente/${clienteId}`);