import React, { useState, useEffect } from 'react';
import { crearReserva, getReserva, updateReserva } from '../../services/ReservarService';
import { listClientes } from '../../services/ClienteService';
import { listMesas } from '../../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';

export const ReservarComponent = () => {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [idMesa, setIdMesa] = useState('');
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [errors, setErrors] = useState({});

  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar clientes y mesas
  useEffect(() => {
    listClientes()
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));

    listMesas()
      .then(res => setMesas(res.data))
      .catch(err => console.error('Error al cargar mesas:', err));
  }, []);

  // Cargar reserva si estamos editando
  useEffect(() => {
    if (id) {
      getReserva(id)
        .then(res => {
          const r = res.data;
          setFecha(r.fecha || '');
          setHora(r.hora || '');
          setIdCliente(r.idCliente || '');
          setIdMesa(r.idMesa || '');
        })
        .catch(err => console.error('Error al obtener reserva:', err));
    }
  }, [id]);

  // Validación del formulario
  const validaForm = () => {
    let valido = true;
    const errorsCopy = {};

    if (!fecha) {
      errorsCopy.fecha = 'Debe seleccionar una fecha';
      valido = false;
    }
    if (!hora) {
      errorsCopy.hora = 'Debe ingresar una hora';
      valido = false;
    }
    if (!idCliente) {
      errorsCopy.idCliente = 'Debe seleccionar un cliente';
      valido = false;
    }
    if (!idMesa) {
      errorsCopy.idMesa = 'Debe seleccionar una mesa';
      valido = false;
    }

    setErrors(errorsCopy);
    return valido;
  };

  // Guardar / Actualizar reserva
  const saveReserva = (e) => {
    e.preventDefault();
    if (!validaForm()) return;

    const data = {
      fecha,
      hora,
      idCliente: Number(idCliente),
      idMesa: Number(idMesa)
    };

    if (id) {
      updateReserva(id, data)
        .then(() => navigate('/reservar/lista', { replace: true }))
        .catch(err => console.error('Error al actualizar reserva:', err));
    } else {
      crearReserva(data)
        .then(() => navigate('/reservar/lista', { replace: true }))
        .catch(err => console.error('Error al crear reserva:', err));
    }
  };

  const titulo = id ? 'Modificar Reserva' : 'Registrar Nueva Reserva';

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 className="text-center mb-4">{titulo}</h2>

      <form onSubmit={saveReserva}>
        {/* Fecha */}
        <div className="mb-3">
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            min={new Date().toISOString().split('T')[0]} // evita fechas pasadas
            onChange={(e) => setFecha(e.target.value)}
            className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
          />
          {errors.fecha && <div className="invalid-feedback">{errors.fecha}</div>}
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label>Hora:</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className={`form-control ${errors.hora ? 'is-invalid' : ''}`}
          />
          {errors.hora && <div className="invalid-feedback">{errors.hora}</div>}
        </div>

        {/* Cliente */}
        <div className="mb-3">
          <label>Cliente:</label>
          <select
            value={idCliente}
            onChange={(e) => setIdCliente(e.target.value)}
            className={`form-control ${errors.idCliente ? 'is-invalid' : ''}`}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clientes.map(c => (
              <option key={c.idcliente} value={c.idcliente}>
                {c.nombreCliente}
              </option>
            ))}
          </select>
          {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
        </div>

       {/* Mesa */}
        <div className="mb-3">
          <label>Mesa:</label>
          <select
            value={idMesa}
            onChange={(e) => setIdMesa(e.target.value)}
            className={`form-control ${errors.idMesa ? 'is-invalid' : ''}`}
          >
            <option value="">-- Seleccione una mesa --</option>
            {mesas
              .filter(m => m.estatus !== 'Ocupado') // <-- filtramos mesas ocupadas
              .map(m => (
                <option key={m.idMesa} value={m.idMesa}>
                  {`Mesa ${m.numero} - ${m.ubicacion} (${m.capacidad} personas)`}
                </option>
              ))
            }
          </select>
          {errors.idMesa && <div className="invalid-feedback">{errors.idMesa}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100">
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
