import React, { useEffect, useState } from 'react';
import { listAtender, deleteAtender, updateAtender } from '../../services/AtenderService';
import { listEmpleados } from '../../services/EmpleadoService';
import { listPedidos } from '../../services/PedidoService';
import { useNavigate } from 'react-router-dom';

export const ListAtenderComponent = () => {
  const [atender, setAtender] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAtender();
    getAllEmpleados();
    getAllPedidos();
  }, []);

  const getAllAtender = () => {
    listAtender()
      .then(res => setAtender(res.data))
      .catch(err => setError('No se pudieron cargar los registros de atender.'));
  };

  const getAllEmpleados = () => {
    listEmpleados()
      .then(res => setEmpleados(res.data))
      .catch(err => console.error('No se pudieron cargar los empleados.'));
  };

  const getAllPedidos = () => {
    listPedidos()
      .then(res => setPedidos(res.data))
      .catch(err => console.error('No se pudieron cargar los pedidos.'));
  };

  const getNombreEmpleado = (id) => {
    const emp = empleados.find(e => e.idEmpleado === id);
    return emp ? emp.nombre : 'N/A';
  };

  const handleAsignarPedido = (idAtender, nuevoIdPedido) => {
    if (!nuevoIdPedido) return;

    const registro = atender.find(a => a.idAtender === idAtender);
    const data = {
      idEmpleado: registro.idEmpleado,
      idPedido: Number(nuevoIdPedido),
    };

    updateAtender(idAtender, data)
      .then(() => getAllAtender())
      .catch(err => console.error('Error al asignar pedido:', err));
  };

  const eliminarRegistro = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
      deleteAtender(id)
        .then(() => getAllAtender())
        .catch(err => console.error('Error al eliminar registro:', err));
    }
  };

  const nuevoPedido = () => {
    navigate('/atender/nuevo'); 
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registro de Atender</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={nuevoPedido}>
          Registrar Atención
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Empleado</th>
              <th>ID Pedido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {atender.length > 0 ? (
              atender.map(a => (
                <tr key={a.idAtender}>
                  <td>{a.idAtender}</td>
                  <td>{getNombreEmpleado(a.idEmpleado)}</td>
                  <td>
                    {a.idPedido ? (
                      a.idPedido
                    ) : (
                      <select
                        value=""
                        onChange={(e) => handleAsignarPedido(a.idAtender, e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="">-- Seleccione un pedido --</option>
                        {pedidos.map(p => (
                          <option key={p.idPedido} value={p.idPedido}>
                            {`ID ${p.idPedido}`}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarRegistro(a.idAtender)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-3">
                  Cargando registros...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
