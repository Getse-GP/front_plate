import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const InicioComponent = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 40);

    // Cargar usuario desde localStorage
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(storedUser);

    return () => clearTimeout(t);
  }, []);

  const transitionStyle = {
    opacity: loaded ? 1 : 0,
    transform: loaded ? "translateY(0)" : "translateY(-20px)",
    transition: "opacity 700ms ease, transform 700ms ease",
  };

  // Función para manejar navegación solo si hay usuario
const handleNavigate = (ruta) => {
  if (!usuario) {
    navigate("/inicio-sesion-requerida", { state: { rutaDestino: ruta } });
    return;
  }
  navigate(ruta);
};


  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light text-dark p-4">
      <div style={transitionStyle} className="text-center mb-5">
        <h1 className="display-4 fw-bold" style={{ color: "#070087ff" }}>Plate & Co.</h1> 
        <p className="lead text-secondary">
          Tu destino para una <strong>experiencia gastronómica excepcional</strong>
        </p>
        <p className="text-muted">Haz tu pedido o reserva en segundos</p>
      </div>

      <div className="row w-100 justify-content-center g-4" style={transitionStyle}>
        <div className="col-md-4">
          <div
            className="card text-center shadow-lg border-0 p-4 h-100 hover-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigate("/producto/productoCliente/")}
          >
            <div className="text-danger fs-1 mb-3">
              <i className="bi bi-plus-circle"></i>
            </div>
            <h4 className="fw-bold">Ver productos</h4>
            <p className="text-muted">
              Explora nuestro menú digital completo y ordena cómodamente desde tu mesa o para llevar.
            </p>
            <button className="btn btn-danger mt-2">Ver Menú →</button>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className="card text-center shadow-lg border-0 p-4 h-100 hover-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => handleNavigate("/reservar/nuevo-cliente")}
          >
            <div className="text-primary fs-1 mb-3">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h4 className="fw-bold">Asegurar tu Mesa</h4>
            <p className="text-muted">
              Reserva tu mesa en línea con anticipación y garantiza tu lugar en Plate & Co.
            </p>
            <button className="btn btn-primary mt-2">Reservar Ahora →</button>
          </div>
        </div>
      </div>

      <footer className="text-muted mt-5 small">
        © {new Date().getFullYear()} Plate & Co. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default InicioComponent;
