import React, { useState, useEffect } from 'react';
import { crearCliente, getCliente, updateCliente } from '../../services/ClienteService';
import { useNavigate, useParams } from 'react-router-dom';

export const ClienteComponent = () => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { id } = useParams();
  const navegar = useNavigate();

  const [errors, setErrors] = useState({
    nombreCliente: '',
    telefono: '',
    correo: '',
    username: '',
    password: ''
  });

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      getCliente(id)
        .then((response) => {
          const cliente = response.data;
          setNombreCliente(cliente.nombreCliente);
          setTelefono(cliente.telefono);
          setCorreo(cliente.correo);
        })
        .catch((error) => console.error('Error al obtener cliente:', error));
    }
  }, [id]);

  // Validación
  function validaForm() {
    let valida = true;
    const errorsCopy = { ...errors };

    if (!nombreCliente.trim()) {
      errorsCopy.nombreCliente = 'El nombre es requerido';
      valida = false;
    } else errorsCopy.nombreCliente = '';

    if (!telefono.trim()) {
      errorsCopy.telefono = 'El teléfono es requerido';
      valida = false;
    } else errorsCopy.telefono = '';

    if (!correo.trim()) {
      errorsCopy.correo = 'El correo es requerido';
      valida = false;
    } else errorsCopy.correo = '';

    // Solo validar usuario si estamos creando
    if (!id) {
      if (!username.trim()) {
        errorsCopy.username = 'El usuario es requerido';
        valida = false;
      } else errorsCopy.username = '';

      if (!password.trim()) {
        errorsCopy.password = 'La contraseña es requerida';
        valida = false;
      } else errorsCopy.password = '';
    }

    setErrors(errorsCopy);
    return valida;
  }

  // Guardar o actualizar cliente
  function saveCliente(e) {
    e.preventDefault();

    if (validaForm()) {
      let cliente = {
        nombreCliente,
        telefono,
        correo
      };

      if (!id) {
        // Agregar objeto usuario para creación
        cliente.usuario = {
          username,
          password
        };
      }

      if (id) {
        updateCliente(id, cliente)
          .then(() => navegar('/cliente/lista', { replace: true }))
          .catch((error) => console.error('Error al actualizar cliente:', error));
      } else {
        crearCliente(cliente)
          .then(() => navegar('/cliente/lista'))
          .catch((error) => console.error('Error al crear cliente:', error));
      }
    }
  }

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
      <h2 className="text-center">{id ? 'Modificar Cliente' : 'Agregar Cliente'}</h2>

      <form onSubmit={saveCliente}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombreCliente}
            className={`form-control ${errors.nombreCliente ? 'is-invalid' : ''}`}
            onChange={(e) => setNombreCliente(e.target.value)}
          />
          {errors.nombreCliente && <div className="invalid-feedback">{errors.nombreCliente}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
            onChange={(e) => setTelefono(e.target.value)}
          />
          {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Correo:</label>
          <input
            type="email"
            value={correo}
            className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
            onChange={(e) => setCorreo(e.target.value)}
          />
          {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
        </div>

        {/* Username y Password solo al crear */}
        {!id && (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label>Usuario:</label>
              <input
                type="text"
                value={username}
                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label>Contraseña:</label>
              <input
                type="password"
                value={password}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>
          </>
        )}

        <button type="submit" className="btn btn-success">
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
