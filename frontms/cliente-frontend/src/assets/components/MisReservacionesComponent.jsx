import React, { useEffect, useState } from 'react';
import { buscarReservasPorClienteId } from '../../services/ReservarService'; 
// Asegúrate de que esta importación sea correcta
import { listMesas } from '../../services/MesaService';
import { listClientes, buscarClientePorIdUsuario } from '../../services/ClienteService'; // ¡Importación CLAVE!
import { useNavigate } from 'react-router-dom';

export const MisReservacionesComponent = () => {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [clientes, setClientes] = useState([]); 
  const [error, setError] = useState(null);
  const [clienteIdAutenticado, setClienteIdAutenticado] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Obtener el usuario de localStorage
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
   // Buscar por 'id' que es lo que guarda el login
    const idUsuario = storedUser?.id || storedUser?.idUsuario || storedUser?.idusuario; 
    if (idUsuario && storedUser?.perfil?.perfil === "Cliente") { 
        //Buscar el ID del Cliente asociado usando el ID del Usuario
        buscarClientePorIdUsuario(idUsuario)
            .then(res => {
                // El DTO del cliente tiene el campo 'idcliente'
                const idCliente = res.data.idcliente; 
                
                if (idCliente) {
                    setClienteIdAutenticado(idCliente);
                    
                    // 3. Cargar datos necesarios y las reservas del cliente
                    getAllMesas();
                    getAllClientes(); // Necesario para mapear nombres de clientes en general
                    getReservasCliente(idCliente); 
                } else {
                    setError('Error: No se encontró el ID de Cliente asociado a este usuario.');
                }
            })
            .catch(err => {
                console.error("Error al buscar cliente:", err);
                setError('Error de comunicación con el servicio de clientes.');
            });

    } else {
        // Muestra el error si no hay usuario o si el perfil no es "Cliente"
        setError('Debes iniciar sesión como Cliente para ver tus reservaciones.');
    }

  }, []);


  // Función para obtener solo las reservas del cliente
  const getReservasCliente = (clienteId) => {
    buscarReservasPorClienteId(clienteId) 
      .then(res => {
        setReservas(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error al cargar mis reservas:', err);
        setError('Ocurrió un error al cargar tus reservaciones.');
      });
  };
    // ... (getAllMesas, getAllClientes, getNombreCliente, getNombreMesa, etc. permanecen igual)

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

  const getNombreCliente = (id) => {
    const cliente = clientes.find(
      c => c.idcliente === id || c.idCliente === id
    );
    
    // Si la reserva es del cliente autenticado, marcamos con "(Tú)"
    if (id === clienteIdAutenticado) {
      return cliente ? (cliente.nombreCliente || cliente.nombre) + ' (Tú)' : 'Tú';
    }
    return cliente ? (cliente.nombreCliente || cliente.nombre) : 'N/A';
  };

  const getNombreMesa = (id) => {
    const mesa = mesas.find(m => m.idMesa === id);
    return mesa ? `Mesa ${mesa.numero} (${mesa.capacidad} personas)` : 'N/A';
  };

  const nuevaReserva = () => {
    navigate('/reservar/nuevo-cliente');
  };
  
  const getRowClass = (estatus) => {
    switch (estatus.toUpperCase()) {
      case 'CONFIRMADA':
        return 'table-success'; 
      case 'PENDIENTE':
        return 'table-warning'; 
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
      <h2 className="text-center mb-4">Mis Reservaciones 📅</h2>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary" onClick={nuevaReserva}>
          Nueva Reserva
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Mesa Asignada</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {sortedReservas.length > 0 ? (
              sortedReservas.map(r => (
                <tr key={r.idReserva} className={getRowClass(r.estatus)}> 
                  <td>{r.idReserva}</td>
                  <td>{r.fecha}</td>
                  <td>{r.hora}</td>
                  <td>{getNombreCliente(r.idCliente)}</td>
                  <td>{getNombreMesa(r.idMesa)}</td>
                  <td>
                    **{r.estatus}**                   </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-3">
                  No tienes reservaciones activas. ¡Crea una nueva!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};