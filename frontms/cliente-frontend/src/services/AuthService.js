import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "auth/login";

// ==== LOGIN ====
export const login = async (username, password) => {
  const res = await axios.post(API_URL, { username, password });
  const { token } = res.data;
  
  if (!token) throw new Error("Token no recibido");
  
  saveToken(token);
  
  // Verificar que se guardó correctamente
  console.log("Token guardado:", token);
  console.log("Usuario decodificado:", getUser());
  
  return token;
};

// ==== GUARDAR TOKEN ====
export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

// ==== OBTENER TOKEN ====
export const getToken = () => localStorage.getItem("token");

// ==== OBTENER USUARIO DEL TOKEN ====
export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    console.log("Token decodificado:", decoded);
    
    // Limpiar el rol quitando el prefijo "ROLE_"
    const rolLimpio = decoded.rol ? decoded.rol.replace("ROLE_", "") : "";
    
    return {
      id: decoded.idUsuario,
      username: decoded.sub,
      perfil: { 
        nombre: rolLimpio // "ROLE_CLIENTE" → "CLIENTE"
      },
      rolCompleto: decoded.rol // Guardamos también el rol completo por si acaso
    };
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

// ==== VALIDAR TOKEN ====
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    // Verificar si el token no ha expirado
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      console.log("Token expirado");
      logout();
      return false;
    }
    return true;
  } catch (error) {
    console.error("Token inválido:", error);
    return false;
  }
};

// ==== CERRAR SESIÓN ====
export const logout = () => {
  localStorage.removeItem("token");
};