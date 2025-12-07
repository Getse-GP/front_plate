// LoginComponent.jsx - Versión Estilizada con Imagen
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import meseroA from "../meseroA.png";  

const LoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/usuario/login", {
        username,
        password,
      });

      const userData = {
        id: res.data.id,
        username: res.data.username,
        perfil: res.data.perfil,
      };
      localStorage.setItem("usuario", JSON.stringify(userData));

      window.dispatchEvent(new Event("storageUpdated"));

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container vh-100 d-flex justify-content-center align-items-center">
      <style jsx="true">{`
        .login-container {
          background: linear-gradient(135deg, #6c757d 0%, #343a40 100%);
        }
        .login-wrapper {
          display: flex; /* Contenedor flex para la imagen y el formulario */
          background-color: #fff; /* Fondo blanco para el wrapper */
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          max-width: 800px; /* Ajusta este ancho según necesites */
          width: 90%; /* Ancho responsivo */
        }
        .image-section {
          flex: 1; /* Ocupa espacio flexible */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f9fa; /* Un fondo claro para la imagen */
          padding: 20px; /* Espacio alrededor de la imagen */
        }
        .image-section img {
          max-width: 100%;
          height: auto;
          display: block; /* Elimina espacio extra debajo de la imagen */
          border-radius: 10px; /* Pequeños bordes redondeados para la imagen */
        }
        .login-card-form {
          flex: 1.2; /* El formulario puede ocupar un poco más de espacio */
          background-color: #fff;
        }
        .card-header-custom {
          background-color: #007bff;
          color: white;
          padding: 20px;
          border-bottom: none;
          text-align: center;
        }
        .card-body-custom {
          padding: 30px;
        }
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        .btn-primary {
          background-color: #007bff;
          border-color: #007bff;
          transition: background-color 0.3s, transform 0.3s;
        }
        .btn-primary:hover {
          background-color: #0056b3;
          border-color: #0056b3;
          transform: translateY(-2px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column; /* Apilar la imagen y el formulario en pantallas pequeñas */
            max-width: 400px; /* Ancho máximo para el formulario apilado */
          }
          .image-section {
            padding: 15px;
            border-bottom: 1px solid #eee; /* Separador */
          }
          .image-section img {
            max-height: 200px; /* Limita la altura de la imagen en móviles */
            width: auto;
          }
        }
      `}</style>
      
      <div className="login-wrapper"> {/* Nuevo contenedor para la imagen y el formulario */}
        
        {/* Sección de la imagen */}
        <div className="image-section">
          <img src={meseroA} alt="Mesero en acción" />
        </div>

        {/* Sección del formulario de login (tu card existente) */}
        <div className="login-card-form">
          <div className="card-header-custom">
            <h2 className="mb-0">Acceso al Sistema</h2>
          </div>

          <div className="card-body-custom">
            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label fw-bold">
                  Usuario
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-control form-control-lg"
                  placeholder="Ingresa tu nombre de usuario"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label fw-bold">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg"
                  placeholder="Ingresa tu contraseña"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-grid gap-2 mb-3">
                <button 
                  className="btn btn-primary btn-lg" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {' '}Ingresando...
                    </>
                  ) : (
                    "Ingresar"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center border-top pt-3">
              <p className="mb-1">¿No tienes cuenta?</p>
              <Link to="/registro" className="text-decoration-none fw-bold">
                Regístrate aquí
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;