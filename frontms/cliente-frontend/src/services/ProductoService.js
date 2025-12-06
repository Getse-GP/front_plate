// ProductoService.js
import axios from 'axios';

const REST_API_BASE_URL = 'api/producto';

export const listProductos = () => axios.get(REST_API_BASE_URL);

export const crearProducto = (formData) => {
  return axios.post(REST_API_BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProducto = (productoId, formData) => {
  return axios.put(`${REST_API_BASE_URL}/${productoId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getProducto = (productoId) => axios.get(`${REST_API_BASE_URL}/${productoId}`);

export const deleteProducto = (productoId) => axios.delete(`${REST_API_BASE_URL}/${productoId}`);

export const updateEstatusProducto = (idProducto, estatus) =>
  axios.patch(`${REST_API_BASE_URL}/${idProducto}/estatus?estatus=${estatus}`);


// Buscar por nombre
export const buscarPorNombre = (nombre) =>
  axios.get(`${REST_API_BASE_URL}/buscar/nombre`, { params: { nombre } });

// Buscar por tipo
export const buscarPorTipo = (idTipo) =>
  axios.get(`${REST_API_BASE_URL}/buscar/tipo/${idTipo}`);

// Buscar por rango de precio
export const buscarPorRangoPrecio = (precioMin, precioMax) =>
  axios.get(`${REST_API_BASE_URL}/buscar/precio`, { params: { precioMin, precioMax } });