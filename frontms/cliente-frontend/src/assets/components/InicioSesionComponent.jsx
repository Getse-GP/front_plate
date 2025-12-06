// InicioSesionComponent.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import meseroS from "../meseroS.png"; // ruta correcta

const InicioSesionComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rutaDestino = location.state?.rutaDestino || "/";

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="row shadow-lg p-4 rounded bg-white" style={{ maxWidth: "900px" }}>
        
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <img
            src={meseroS}
            alt="Mesero solicitando inicio de sesión"
            className="img-fluid"
            style={{ maxHeight: "280px" }}
          />
        </div>

        <div className="col-md-7 d-flex flex-column justify-content-center">
          <h2 className="fw-bold mb-3" style={{ color: "#070087ff" }}>
            ¡Necesitas iniciar sesión!
          </h2>

          <p className="text-muted mb-4">
            Para acceder a esta opción debes iniciar sesión con tu cuenta.
          </p>

          <div className="d-flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login", { state: { rutaDestino } })}
            >
              Iniciar Sesión
            </button>

            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InicioSesionComponent;
