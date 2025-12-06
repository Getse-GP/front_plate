import React, { useEffect, useState } from 'react';
import { deleteEmpleado, listEmpleados, buscarEmpleadosPorNombre, buscarEmpleadosPorPuesto}
 from '../../services/EmpleadoService';
import { useNavigate } from 'react-router-dom';

export const ListEmpleadoComponent = () => {
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState(null);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaPuesto, setBusquedaPuesto] = useState('');
  const navegar = useNavigate();

  // Cargar empleados al montar el componente
  useEffect(() => {
    getAllEmpleados();
  }, []);

  function getAllEmpleados() {
    listEmpleados()
      .then((response) => {
        setEmpleados(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener empleados:', error);
        setError('No se pudieron cargar los empleados.');
      });
  }

  // Crear nuevo empleado
  const nuevoEmpleado = () => navegar('/empleado/nuevo');

  // Editar empleado existente
  const actualizarEmpleado = (id) => navegar(`/empleado/edita/${id}`);

  // Eliminar empleado
  const eliminarEmpleado = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este empleado?')) {
      deleteEmpleado(id)
        .then(() => getAllEmpleados())
        .catch((error) => console.error('Error al eliminar empleado:', error));
    }
  };

  //Buscar por nombre
  const handleBuscarPorNombre = () => {
    if (!busquedaNombre.trim()) {
      getAllEmpleados();
      return;
    }

    buscarEmpleadosPorNombre(busquedaNombre)
      .then((response) => setEmpleados(response.data))
      .catch(() => setError('No se encontraron empleados con ese nombre.'));
  };

  //Buscar por puesto
  const handleBuscarPorPuesto = () => {
    if (!busquedaPuesto.trim()) {
      getAllEmpleados();
      return;
    }

    buscarEmpleadosPorPuesto(busquedaPuesto)
      .then((response) => setEmpleados(response.data))
      .catch(() => setError('No se encontraron empleados con ese puesto.'));
  };

  //Limpiar búsquedas
  const limpiarBusqueda = () => {
    setBusquedaNombre('');
    setBusquedaPuesto('');
    getAllEmpleados();
  };

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
      <h2 className="text-center mb-4">Registro de Empleados</h2>

      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <button className="btn btn-primary" onClick={nuevoEmpleado}>
          Nuevo Empleado
        </button>

        {/*Búsqueda por nombre */}
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar por nombre..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscarPorNombre()}
            style={{ width: '220px' }}
          />
          <button className="btn btn-outline-success me-2" onClick={handleBuscarPorNombre}>
            Buscar
          </button>
        </div>

        {/* Búsqueda por puesto */}
        <div className="d-flex align-items-center">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar por puesto..."
            value={busquedaPuesto}
            onChange={(e) => setBusquedaPuesto(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscarPorPuesto()}
            style={{ width: '220px' }}
          />
          <button className="btn btn-outline-info me-2" onClick={handleBuscarPorPuesto}>
            Buscar
          </button>
        </div>

        {/*Botón para limpiar */}
        <button className="btn btn-secondary" onClick={limpiarBusqueda}>
          Limpiar
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th style={{ width: '8%', textAlign: 'center' }}>ID</th>
              <th>Nombre</th>
              <th>Puesto</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.length > 0 ? (
              empleados.map((empleado) => (
                <tr key={empleado.idEmpleado}>
                  <td style={{ textAlign: 'center' }}>{empleado.idEmpleado}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.puesto}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => actualizarEmpleado(empleado.idEmpleado)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarEmpleado(empleado.idEmpleado)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  No hay empleados que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
