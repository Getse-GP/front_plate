import React, { useState, useEffect } from 'react';
import { crearTipo, getTipo, updateTipo } from '../../services/TipoService';
import { useNavigate, useParams } from 'react-router-dom';

export const TipoComponent = () => {
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const { id } = useParams();
  const navegar = useNavigate();

  const [errors, setErrors] = useState({
    tipo: '',
    descripcion: '',
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      getTipo(id)
        .then((response) => {
          const tipoData = response.data;
          setTipo(tipoData.tipo);
          setDescripcion(tipoData.descripcion);
        })
        .catch((error) => console.error('Error al obtener tipo:', error));
    }
  }, [id]);

  // Validar formulario
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (!tipo.trim()) {
      errorsCopy.tipo = 'El nombre del tipo es requerido';
      valida = false;
    } else errorsCopy.tipo = '';

    if (!descripcion.trim()) {
      errorsCopy.descripcion = 'La descripción es requerida';
      valida = false;
    } else errorsCopy.descripcion = '';

    setErrors(errorsCopy);
    return valida;
  }

  // Guardar o actualizar tipo
  function saveTipo(e) {
    e.preventDefault();

    if (validaForm()) {
      const tipoData = { tipo, descripcion };

      if (id) {
        // Actualizar tipo existente
        updateTipo(id, tipoData)
          .then((response) => {
            console.log('Tipo actualizado:', response.data);
            navegar('/tipo/lista', { replace: true });
          })
          .catch((error) => console.error('Error al actualizar tipo:', error));
      } else {
        // Crear nuevo tipo
        crearTipo(tipoData)
          .then((response) => {
            console.log('Tipo creado:', response.data);
            navegar('/tipo/lista', { replace: true });
          })
          .catch((error) => console.error('Error al crear tipo:', error));
      }
    }
  }

  // Título dinámico
  const pagTitulo = () => (
    <h2 className="text-center">{id ? 'Modificar Tipo de Comida' : 'Agregar Tipo de Comida'}</h2>
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

      <form onSubmit={saveTipo}>
        <div style={{ marginBottom: '10px' }}>
          <label>Tipo:</label>
          <input
            type="text"
            value={tipo}
            className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
            onChange={(e) => setTipo(e.target.value)}
            placeholder="Ej. Bebida, Postre"
          />
          {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej. Frías, Dulces"
          />
          {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
        </div>

        <button type="submit" className="btn btn-success">
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
