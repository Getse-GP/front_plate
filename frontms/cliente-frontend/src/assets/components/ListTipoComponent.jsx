import React, { useEffect, useState } from 'react';
import { listTipos, deleteTipo } from '../../services/TipoService';
import { useNavigate } from 'react-router-dom';

export const ListTipoComponent = () => {
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const navegar = useNavigate();

  // Cargar tipos desde el servicio
  useEffect(() => {
    getAllTipos();
  }, []);

  function getAllTipos() {
    listTipos()
      .then((response) => {
        setTipos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener tipos:", error);
        setError("No se pudieron cargar los tipos. Intenta más tarde.");
      });
  }

  // Navegar a crear tipo
  const nuevoTipo = () => {
    navegar('/tipo/nuevo');
  };

  // Navegar a editar tipo
  const actualizarTipo = (id) => {
    navegar(`/tipo/edita/${id}`);
  };

  // Eliminar tipo
  function eliminarTipo(id) {
    console.log("Eliminando tipo con ID:", id);
    deleteTipo(id)
      .then(() => {
        getAllTipos();
      })
      .catch((error) => {
        console.error("Error al eliminar tipo:", error);
        setError("No se pudo eliminar el tipo. Intenta nuevamente.");
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

  console.log("Tipos recibidos desde el backend:", JSON.stringify(tipos, null, 2));

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Tipos de Comida</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={nuevoTipo}>
          Nuevo Tipo
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th style={{ width: '10%', textAlign: 'center' }}>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tipos.length > 0 ? (
              tipos.map((tipo) => (
                <tr key={tipo.idTipo}>
                  <td style={{ textAlign: 'center' }}>{tipo.idTipo}</td>
                  <td>{tipo.tipo}</td>
                  <td>{tipo.descripcion}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => actualizarTipo(tipo.idTipo)}
                    >
                      Actualizar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarTipo(tipo.idTipo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  Cargando tipos o lista vacía...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
