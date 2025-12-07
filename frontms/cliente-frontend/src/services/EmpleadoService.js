import axios from "axios";

const REST_API_BASE_URL='/api/empleado';

export const listEmpleados = () => axios.get(REST_API_BASE_URL);

export const crearEmpleado=(empleado) => axios.post(REST_API_BASE_URL, empleado);

// Obtener empleado por ID
export const getEmpleado = (empleadoId) => axios.get(`${REST_API_BASE_URL}/${empleadoId}`);

// Actualizar empleado existente
export const updateEmpleado = (empleadoId, empleado) => axios.put(`${REST_API_BASE_URL}/${empleadoId}`, empleado);

// Eliminar empleado
export const deleteEmpleado = (empleadoId) => axios.delete(`${REST_API_BASE_URL}/${empleadoId}`);

// Buscar empleados por nombre o letra
export const buscarEmpleadosPorNombre = (nombre) => axios.get(`${REST_API_BASE_URL}/buscar/nombre?nombre=${nombre}`);

// Buscar empleados por puesto
export const buscarEmpleadosPorPuesto = (puesto) => axios.get(`${REST_API_BASE_URL}/buscar/puesto?puesto=${puesto}`);

export const buscarEmpleadoPorIdUsuario = (idUsuario) => {
    // La URL debe coincidir con el endpoint del controlador
    return axios.get(REST_API_BASE_URL + '/usuario/' + idUsuario); 
};