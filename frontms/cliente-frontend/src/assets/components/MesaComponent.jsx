import React, { useState, useEffect } from 'react';
import { crearMesa, getMesa, updateMesa } from '../../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';

export const MesaComponent = () => {
  const [numero, setNumero] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const { id } = useParams(); // para edición
  const navegar = useNavigate();

  const [errors, setErrors] = useState({
    numero: '',
    capacidad: '',
    ubicacion: '',
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      getMesa(id)
        .then((response) => {
          const mesa = response.data;
          setNumero(mesa.numero);
          setCapacidad(mesa.capacidad);
          setUbicacion(mesa.ubicacion);
        })
        .catch((error) => console.error('Error al obtener mesa:', error));
    }
  }, [id]);

  // Validar campos
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (!numero || numero <= 0) {
      errorsCopy.numero = 'El número es requerido y debe ser mayor a 0';
      valida = false;
    } else errorsCopy.numero = '';

    if (!capacidad || capacidad <= 0) {
      errorsCopy.capacidad = 'La capacidad es requerida y debe ser mayor a 0';
      valida = false;
    } else errorsCopy.capacidad = '';

    if (!ubicacion.trim()) {
      errorsCopy.ubicacion = 'La ubicación es requerida';
      valida = false;
    } else errorsCopy.ubicacion = '';

    setErrors(errorsCopy);
    return valida;
  }

  // Guardar o actualizar mesa
  function saveMesa(e) {
    e.preventDefault();

    if (validaForm()) {
      const mesaData = { numero: parseInt(numero), capacidad: parseInt(capacidad), ubicacion };

      if (id) {
        // Actualizar mesa
        updateMesa(id, mesaData)
          .then(() => navegar('/mesa/lista', { replace: true }))
          .catch((error) => console.error('Error al actualizar mesa:', error));
      } else {
        // Crear nueva mesa
        crearMesa(mesaData)
          .then(() => navegar('/mesa/lista'))
          .catch((error) => console.error('Error al crear mesa:', error));
      }
    }
  }

  // Título dinámico
  const pagTitulo = () => (
    <h2 className="text-center">{id ? 'Modificar Mesa' : 'Agregar Mesa'}</h2>
  );

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
      }}
    >
      {pagTitulo()}

      <form onSubmit={saveMesa}>
        <div style={{ marginBottom: '10px' }}>
          <label>Número de mesa:</label>
          <input
            type="number"
            value={numero}
            className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
            onChange={(e) => setNumero(e.target.value)}
            placeholder="Ej. 2"
          />
          {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Capacidad:</label>
          <input
            type="number"
            value={capacidad}
            className={`form-control ${errors.capacidad ? 'is-invalid' : ''}`}
            onChange={(e) => setCapacidad(e.target.value)}
            placeholder="Ej. 8"
          />
          {errors.capacidad && <div className="invalid-feedback">{errors.capacidad}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Ubicación:</label>
          <select
            value={ubicacion}
            className={`form-control ${errors.ubicacion ? 'is-invalid' : ''}`}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option value="" disabled>Seleccione una zona</option>
            <option value="Terraza">Terraza</option>
            <option value="Salón Principal">Salón Principal</option>
            <option value="Barra">Barra</option>
            <option value="Jardín">Jardín</option>
            <option value="Privado">Privado</option>
            <option value="Balcón">Balcón</option>
          </select>
          {errors.ubicacion && <div className="invalid-feedback">{errors.ubicacion}</div>}
        </div>

        <button type="submit" className="btn btn-success">
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
