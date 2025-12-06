import axios from "axios";

const REST_API_BASE_URL='api/pedido';

export const listPedidos = () => axios.get(REST_API_BASE_URL);

export const crearPedido=(pedido) => axios.post(REST_API_BASE_URL, pedido);

// Obtener un pedido por ID
export const getPedido = (pedidoId) => axios.get(`${REST_API_BASE_URL}/${pedidoId}`);

// Actualizar un pedido por ID
export const updatePedido = (pedidoId, pedido) => axios.put(`${REST_API_BASE_URL}/${pedidoId}`, pedido);

// Eliminar un pedido por ID
export const deletePedido = (pedidoId) => axios.delete(`${REST_API_BASE_URL}/${pedidoId}`);

// Buscar pedidos por fecha (usa formato yyyy-MM-dd)
export const buscarPedidosPorFecha = (fecha) => axios.get(`${REST_API_BASE_URL}/buscar/fecha`, { params: { fecha },});
