// RegistroComponent.jsx (Nuevo Archivo)

import React, { useState } from 'react';
import { crearCliente } from '../../services/ClienteService'; // Asegúrate que esta ruta es correcta
import { useNavigate } from 'react-router-dom';

export const RegistroComponent = () => {
  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [globalError, setGlobalError] = useState('');

  const navegar = useNavigate();

  const [errors, setErrors] = useState({
    nombreCliente: '',
    telefono: '',
    correo: '',
    username: '',
    password: ''
  });

  // Validación
  function validaForm() {
    let valida = true;
    const errorsCopy = { 
        nombreCliente: '', telefono: '', correo: '', username: '', password: '' 
    };

    if (!nombreCliente.trim()) {
      errorsCopy.nombreCliente = 'El nombre es requerido';
      valida = false;
    }

    if (!telefono.trim()) {
      errorsCopy.telefono = 'El teléfono es requerido';
      valida = false;
    }

    if (!correo.trim()) {
      errorsCopy.correo = 'El correo es requerido';
      valida = false;
    }

    if (!username.trim()) {
      errorsCopy.username = 'El usuario es requerido';
      valida = false;
    }

    if (!password.trim()) {
      errorsCopy.password = 'La contraseña es requerida';
      valida = false;
    }

    setErrors(errorsCopy);
    return valida;
  }

  // Guardar cliente (Registro)
  function saveCliente(e) {
    e.preventDefault();
    setGlobalError('');

    if (validaForm()) {
      let cliente = {
        nombreCliente,
        telefono,
        correo,
        // Incluye el objeto usuario para la creación
        usuario: {
          username,
          password,
          // Nota: El backend debe asignar el 'perfil' de 'cliente'
        },
      };

      crearCliente(cliente)
        .then(() => {
          // Registro exitoso, redirigir al login
          alert('Registro exitoso. ¡Inicia sesión para continuar!');
          navegar('/login'); 
        })
        .catch((error) => {
          console.error('Error al crear cliente (registro):', error);
          setGlobalError(error.response?.data?.message || 'Error al registrar. Intenta de nuevo.');
        });
    }
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div 
        className="card p-4 shadow" 
        style={{
          maxWidth: '400px',
        }}
      >
        <h2 className="text-center mb-4">Registro de Cliente</h2>
        {globalError && <div className="alert alert-danger">{globalError}</div>}

        <form onSubmit={saveCliente}>
          <div className="mb-3">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombreCliente}
              className={`form-control ${errors.nombreCliente ? 'is-invalid' : ''}`}
              onChange={(e) => setNombreCliente(e.target.value)}
            />
            {errors.nombreCliente && <div className="invalid-feedback">{errors.nombreCliente}</div>}
          </div>

          <div className="mb-3">
            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
          </div>

          <div className="mb-3">
            <label>Correo:</label>
            <input
              type="email"
              value={correo}
              className={`form-control ${errors.correo ? 'is-invalid' : ''}`}
              onChange={(e) => setCorreo(e.target.value)}
            />
            {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
          </div>

          <div className="mb-3">
            <label>Usuario:</label>
            <input
              type="text"
              value={username}
              className={`form-control ${errors.username ? 'is-invalid' : ''}`}
              onChange={(e) => setUsername(e.target.value)}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="mb-3">
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistroComponent;