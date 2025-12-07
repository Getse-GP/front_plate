
import axios from "axios";

const PERFIL_API_URL = "/api/perfil";

export const listPerfiles = () => axios.get(PERFIL_API_URL);
