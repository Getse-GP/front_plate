// HeaderComponent.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const activeAccentColor = "#FF5722";

export const HeaderComponent = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(storedUser);
    };

    loadUser();
    window.addEventListener("storageUpdated", loadUser);

    return () => window.removeEventListener("storageUpdated", loadUser);
  }, []);

  const handleLoginClick = () => navigate("/login");

  const handleLogoutClick = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/");
  };

  const getNavLinkClassName = (isActive) =>
    "nav-link text-white" + (isActive ? " active-plate-co fw-semibold" : " text-opacity-75");

  const getNavLinkStyle = ({ isActive }) => ({
    color: isActive ? activeAccentColor : undefined,
  });

  const rol = usuario?.perfil?.perfil || "";

  return (
    <header style={{ backgroundColor: "#1A237E" }}>
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container-fluid">
          <NavLink to="/" className="navbar-brand fw-bold fs-4 text-white">
            Plate & Co.
          </NavLink>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {/* Links visibles para todos */}
              <li className="nav-item">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => getNavLinkClassName(isActive)}
                  style={getNavLinkStyle}
                >
                  Inicio
                </NavLink>
              </li>

              {/* Links por rol */}
              {rol === "Cliente" && (
  <>
    <li className="nav-item">
      <NavLink
        to="/producto/productoCliente/"
        className={({ isActive }) => getNavLinkClassName(isActive)}
        style={getNavLinkStyle}
      >
        Productos
      </NavLink>
    </li>
    <li className="nav-item">
      <NavLink
        to="/misreservas"
        className={({ isActive }) => getNavLinkClassName(isActive)}
        style={getNavLinkStyle}
      >
        Mis Reservaciones
      </NavLink>
    </li>
  </>
)}

              {rol === "Mesero" && (
                <li className="nav-item">
                  <NavLink
                    to="/mis-pedidos"
                    className={({ isActive }) => getNavLinkClassName(isActive)}
                    style={getNavLinkStyle}
                  >
                    Pedidos
                  </NavLink>
                </li>
              )}

              {rol === "Cajero" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/pedido"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Pedidos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/reservar"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Reservaciones
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/cliente"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Clientes
                    </NavLink>
                  </li>
                </>
              )}

              {rol === "Cocinero" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/pedido"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Pedidos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/producto"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Productos
                    </NavLink>
                  </li>
                </>
              )}

              {rol === "Supervisor" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/cliente"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Clientes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/empleado"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Empleados
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/producto"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Productos
                    </NavLink>
                  </li>
                </>
              )}

              {rol === "Administrador" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/producto"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Productos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/pedido"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Pedidos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/cliente"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Clientes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/empleado"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Empleados
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/reservar"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Reservaciones
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/mesa"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Mesas
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/tipo"
                      className={({ isActive }) => getNavLinkClassName(isActive)}
                      style={getNavLinkStyle}
                    >
                      Tipos
                    </NavLink>
                  </li>
                </>
              )}

              {/* Botón login/logout */}
              {!usuario ? (
                <li className="nav-item">
                  <button
                    onClick={handleLoginClick}
                    className="btn btn-outline-light ms-2"
                    style={{ borderColor: "#FF5722", color: "#FF5722" }}
                  >
                    Ingresar
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item d-flex align-items-center ms-3 text-white">
                    {usuario.username} ({usuario.perfil?.perfil || "Sin rol"})
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLogoutClick}
                      className="btn btn-outline-light ms-2"
                      style={{ borderColor: "#FF5722", color: "#FF5722" }}
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default HeaderComponent;
