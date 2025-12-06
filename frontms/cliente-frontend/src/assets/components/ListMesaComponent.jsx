import React, { useEffect, useState } from 'react';
import { listMesas, deleteMesa } from '../../services/MesaService';
import { useNavigate } from 'react-router-dom';

export const ListMesaComponent = () => {
  const [mesas, setMesas] = useState([]);
  const [error, setError] = useState(null);
  const navegar = useNavigate();

  // Cargar mesas desde el servicio
  useEffect(() => {
    getAllMesas();
  }, []);

  function getAllMesas() {
    listMesas()
      .then((response) => setMesas(response.data))
      .catch((err) => {
        console.error(err);
        setError("Error al obtener mesas desde el servidor");
      });
  }

  // Navegar a crear mesa
  const nuevaMesa = () => {
    navegar('/mesa/nuevo');
  };

  // Navegar a editar mesa
  const actualizarMesa = (id) => {
    navegar(`/mesa/edita/${id}`);
  };

  // Eliminar mesa
  function eliminarMesa(id) {
    deleteMesa(id)
      .then(() => getAllMesas())
      .catch((err) => {
        console.error(err);
        setError("Error al eliminar la mesa");
      });
  }

  // Mostrar error si la API falla
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registro de Mesas</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={nuevaMesa}>
          Nueva Mesa
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th style={{ width: '8%', textAlign: 'center' }}>ID Mesa</th>
              <th>Número</th>
              <th>Capacidad</th>
              <th>Ubicación</th>
              <th>Estatus</th> {/* ✅ Nueva columna */}
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mesas.length > 0 ? (
              mesas.map((mesa) => (
                <tr key={mesa.idMesa}>
                  <td style={{ textAlign: 'center' }}>{mesa.idMesa}</td>
                  <td>{mesa.numero}</td>
                  <td>{mesa.capacidad}</td>
                  <td>{mesa.ubicacion}</td>

                  {/* ✅ Mostrar estatus con color visual */}
                  <td>
                    {mesa.estatus === "Ocupado" ? (
                      <span className="badge bg-danger">Ocupado</span>
                    ) : (
                      <span className="badge bg-success">Disponible</span>
                    )}
                  </td>

                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => actualizarMesa(mesa.idMesa)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarMesa(mesa.idMesa)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                  Cargando mesas o lista vacía...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
