import React, { useEffect, useState } from 'react';
import { listReservas, deleteReserva, buscarReservasPorFecha } from '../../services/ReservarService';
import { listMesas } from '../../services/MesaService';
import { listClientes } from '../../services/ClienteService';
import { useNavigate } from 'react-router-dom';

export const ListReservarComponent = () => {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const [fechaFiltro, setFechaFiltro] = useState('');
const [modoFiltro, setModoFiltro] = useState(false);

  useEffect(() => {
    getAllReservas();
    getAllMesas();
    getAllClientes();
  }, []);

  const getAllReservas = () => {
    listReservas()
      .then(res => setReservas(res.data))
      .catch(() => setError('No se pudieron cargar las reservas.'));
  };

  const getAllMesas = () => {
    listMesas()
      .then(res => setMesas(res.data))
      .catch(() => console.error('No se pudieron cargar las mesas.'));
  };

  const getAllClientes = () => {
    listClientes()
      .then(res => setClientes(res.data))
      .catch(() => console.error('No se pudieron cargar los clientes.'));
  };

  const buscarPorFecha = async () => {
  if (!fechaFiltro) {
    alert('Selecciona una fecha');
    return;
  }

  try {
    const res = await buscarReservasPorFecha(fechaFiltro);
    const reservasData = res.data;

    if (reservasData.length === 0) {
      alert('No se encontraron reservas para esa fecha');
      return;
    }

    setReservas(reservasData);
    setModoFiltro(true);
  } catch (error) {
    console.error('Error al buscar reservas por fecha:', error);
  }
};

const limpiarFiltro = () => {
  setFechaFiltro('');
  setModoFiltro(false);
  getAllReservas();
};


  const getNombreCliente = (id) => {
    const cliente = clientes.find(
      c => c.idcliente === id || c.idCliente === id
    );
    return cliente ? (cliente.nombreCliente || cliente.nombre) : 'N/A';
  };

  const getNombreMesa = (id) => {
    const mesa = mesas.find(m => m.idMesa === id);
    return mesa ? `Mesa ${mesa.numero} - ${mesa.ubicacion} (${mesa.capacidad} personas)` : 'N/A';
  };

  const editarReserva = (idReserva) => {
    navigate(`/reservar/editar/${idReserva}`);
  };

  const cancelarReserva = (id) => {
    if (window.confirm('¿Seguro que deseas cancelar esta reserva?')) {
      deleteReserva(id)
        .then(() => getAllReservas())
        .catch(err => console.error('Error al cancelar reserva:', err));
    }
  };

  const nuevaReserva = () => {
    navigate('/reservar/nuevo');
  };
  
  // Función para determinar la clase de la fila basada en el estatus
  const getRowClass = (estatus) => {
    switch (estatus.toUpperCase()) {
      case 'CONFIRMADA':
        return 'table-success'; // Color verde claro para Confirmada
      case 'PENDIENTE':
        return 'table-warning'; // Color amarillo claro para Pendiente
      case 'CANCELADA':
        return 'table-danger'; 
      default:
        return '';
    }
  };

  
  const sortedReservas = [...reservas].sort((a, b) => {

    const dateTimeA = `${a.fecha}T${a.hora}`;
    const dateTimeB = `${b.fecha}T${b.hora}`;

 
    const dateA = new Date(dateTimeA);
    const dateB = new Date(dateTimeB);

    // Orden descendente (más reciente primero)
    return dateB - dateA;
  });

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Listado de Reservas</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={nuevaReserva}>
          Nueva Reserva
        </button>
      </div>
<div className="d-flex align-items-center gap-2 mb-3">
  <input
    type="date"
    value={fechaFiltro}
    onChange={(e) => setFechaFiltro(e.target.value)}
    className="form-control w-auto"
  />
  <button className="btn btn-primary" onClick={buscarPorFecha}>
    🔍 Buscar por fecha
  </button>
  {modoFiltro && (
    <button className="btn btn-secondary" onClick={limpiarFiltro}>
      ↩️ Ver todas
    </button>
  )}
</div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Mesa</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservas.length > 0 ? (
              sortedReservas.map(r => (
                <tr key={r.idReserva} className={getRowClass(r.estatus)}> {/* Aplicar clase condicional aquí */}
                  <td>{r.idReserva}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{getNombreCliente(r.idCliente)}</td>
                  <td>{getNombreMesa(r.idMesa)}</td>
                  <td>{r.estatus}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => editarReserva(r.idReserva)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelarReserva(r.idReserva)}
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
                  Cargando reservas...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};