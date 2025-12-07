import axios from "axios";

const REST_API_BASE_URL = "/api/Detalle";

export const listDetalles = () => axios.get(REST_API_BASE_URL);
