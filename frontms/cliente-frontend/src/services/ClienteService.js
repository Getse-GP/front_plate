import axios from "axios";

const REST_API_BASE_URL='api/cliente';

export const listClientes = () => axios.get(REST_API_BASE_URL);

export const crearCliente=(cliente) => axios.post(REST_API_BASE_URL, cliente);

export const getCliente=(clienteId) => axios.get(REST_API_BASE_URL + '/' +clienteId);

export const updateCliente =(clienteId, cliente)=> axios.put(REST_API_BASE_URL + '/' + clienteId, cliente);

export const deleteCliente=(clienteId)=> axios.delete(REST_API_BASE_URL + '/' + clienteId);

export const buscarClientes = (nombre) => axios.get(`${REST_API_BASE_URL}/buscar?nombre=${nombre}`);

export const buscarClientePorIdUsuario = (idUsuario) => 
    axios.get(`${REST_API_BASE_URL}/usuario/${idUsuario}`);