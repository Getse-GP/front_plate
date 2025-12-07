import axios from "axios";

const REST_API_BASE_URL='/api/tipo';

export const listTipos = () => axios.get(REST_API_BASE_URL);

export const crearTipo=(tipo) => axios.post(REST_API_BASE_URL, tipo);

export const getTipo = (tipoId) => axios.get(`${REST_API_BASE_URL}/${tipoId}`);

export const updateTipo = (tipoId, tipo) => axios.put(`${REST_API_BASE_URL}/${tipoId}`, tipo);

export const deleteTipo = (tipoId) => axios.delete(`${REST_API_BASE_URL}/${tipoId}`);