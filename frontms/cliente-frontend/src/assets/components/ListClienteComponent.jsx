import React, { useEffect, useState } from 'react';
import { deleteCliente, listClientes, buscarClientes } from '../../services/ClienteService';
import { useNavigate } from 'react-router-dom';

export const ListClienteComponent = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const navegar = useNavigate();

  useEffect(() => {
    getAllCliente();
  }, []);
  
  function getAllCliente() {
    listClientes()
      .then((response) => setClientes(response.data))
      .catch((error) => setError('Error al cargar clientes'));
  }

  const nuevoCliente = () => navegar('/cliente/nuevo');

  const actualizarCliente = (id) => navegar(`/cliente/edita/${id}`);

  function eliminarCliente(id) {
    deleteCliente(id)
      .then(() => getAllCliente())
      .catch((error) => setError('Error al eliminar cliente'));
  }

  // Buscar cliente por nombre o letra
  function handleBuscar() {
    if (!busqueda.trim()) {
      getAllCliente(); // Si está vacío, vuelve a mostrar todos
      return;
    }

    buscarClientes(busqueda)
      .then((response) => setClientes(response.data))
      .catch(() => setError('No se encontraron coincidencias'));
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registro de Clientes</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={nuevoCliente}>
          Nuevo Cliente
        </button>

        {/* Barra de búsqueda */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Buscar por nombre o letra..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            style={{ width: '250px' }}
          />
          <button className="btn btn-outline-success" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>

      <div className="table-responsive">
       <table className="table table-striped table-bordered shadow-sm">
  <thead className="table-light">
    <tr>
      <th>ID</th>
      <th>Nombre</th>
      <th>Teléfono</th>
      <th>Correo</th>
      <th>Usuario asignado</th>
      <th className="text-center">Acciones</th>
    </tr>
  </thead>

  <tbody>
    {clientes.length > 0 ? (
      clientes.map((cliente) => (
        <tr key={cliente.idcliente}>
          <td>{cliente.idcliente}</td>
          <td>{cliente.nombreCliente}</td>
          <td>{cliente.telefono}</td>
          <td>{cliente.correo}</td>

          {/* Nueva columna */}
          <td>
            {cliente.usuario 
              ? cliente.usuario.username
              : <span className="text-muted">Sin usuario</span>}
          </td>

          <td className="text-center">
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => actualizarCliente(cliente.idcliente)}
            >
              Actualizar
            </button>

            <button
              className="btn btn-danger btn-sm"
              onClick={() => eliminarCliente(cliente.idcliente)}
            >
              Eliminar
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-center text-muted py-3">
          No hay clientes que coincidan con la búsqueda.
        </td>
      </tr>
    )}
  </tbody>
</table>

      </div>
    </div>
  );
};
