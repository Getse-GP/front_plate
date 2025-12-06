import React, { useState, useEffect } from 'react';
import { crearEmpleado, getEmpleado, updateEmpleado } from '../../services/EmpleadoService';
import { listPerfiles } from '../../services/PerfilService';
import { useNavigate, useParams } from 'react-router-dom';

export const EmpleadoComponent = () => {
  const [nombre, setNombre] = useState('');
  const [puesto, setPuesto] = useState('');
  const [perfilId, setPerfilId] = useState('');
  const [perfiles, setPerfiles] = useState([]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({ nombre: '', puesto: '', perfil: '', username: '', password: '' });

  const { id } = useParams();
  const navegar = useNavigate();

  // Cargar empleado si estamos editando
  useEffect(() => {
    if (id) {
      getEmpleado(id)
        .then((response) => {
          const empleado = response.data;

          setNombre(empleado.nombre);
          setPuesto(empleado.puesto);
          setPerfilId(empleado.usuario?.perfil?.id || '');

          setUsername(empleado.usuario?.username || '');
          setPassword(''); // nunca se envía el password desde el backend
        })
        .catch((error) => console.error('Error al obtener empleado:', error));
    }
  }, [id]);

  // Cargar lista de perfiles
  useEffect(() => {
    listPerfiles()
      .then((res) => setPerfiles(res.data))
      .catch((err) => console.error("Error cargando perfiles:", err));
  }, []);

  // Validación
  const validaForm = () => {
    let valido = true;
    const e = { nombre: '', puesto: '', perfil: '', username: '', password: '' };

    if (!nombre.trim()) {
      e.nombre = 'El nombre es requerido';
      valido = false;
    }
    if (!puesto.trim()) {
      e.puesto = 'Debe seleccionar un puesto';
      valido = false;
    }
    if (!perfilId) {
      e.perfil = 'Debe seleccionar un perfil';
      valido = false;
    }
    if (!username.trim()) {
      e.username = 'El nombre de usuario es requerido';
      valido = false;
    }
    if (!id && !password.trim()) {
      e.password = 'La contraseña es requerida';
      valido = false;
    }

    setErrors(e);
    return valido;
  };

  // Guardar o actualizar
  const saveEmpleado = (e) => {
    e.preventDefault();
    if (!validaForm()) return;

    const empleadoData = {
      nombre,
      puesto,
      usuario: {
        username,
        password: password || undefined,
        perfil: { id: perfilId }
      }
    };

    if (id) {
      updateEmpleado(id, empleadoData)
        .then(() => navegar('/empleado/lista', { replace: true }))
        .catch((error) => console.error('Error al actualizar empleado:', error));
    } else {
      crearEmpleado(empleadoData)
        .then(() => navegar('/empleado/lista', { replace: true }))
        .catch((error) => console.error('Error al crear empleado:', error));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 className="text-center">{id ? 'Modificar Empleado' : 'Registrar Empleado'}</h2>

      <form onSubmit={saveEmpleado}>

        {/* Nombre */}
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            placeholder="Ej. Dante Alighieri"
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
        </div>

        {/* Puesto */}
        <div style={{ marginBottom: '10px' }}>
          <label>Puesto:</label>
          <select
            value={puesto}
            onChange={(e) => setPuesto(e.target.value)}
            className={`form-control ${errors.puesto ? 'is-invalid' : ''}`}
          >
            <option value="">-- Seleccione un puesto --</option>
            <option value="Cajero">Cajero</option>
            <option value="Mesero">Mesero</option>
            <option value="Cocinero">Cocinero</option>
             <option value="Cocinero">Supervisor</option>
              <option value="Cocinero">Administrador</option>
          </select>
          {errors.puesto && <div className="invalid-feedback">{errors.puesto}</div>}
        </div>

        {/* Username */}
        <div style={{ marginBottom: '10px' }}>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            placeholder="Ej. bob23"
          />
          {errors.username && <div className="invalid-feedback">{errors.username}</div>}
        </div>

        {/* Password (solo cuando se crea) */}
        {!id && (
          <div style={{ marginBottom: '10px' }}>
            <label>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        )}

        {/* PERFIL DESDE LA BD */}
        <div style={{ marginBottom: '10px' }}>
          <label>Perfil:</label>
          <select
            value={perfilId}
            onChange={(e) => setPerfilId(e.target.value)}
            className={`form-control ${errors.perfil ? 'is-invalid' : ''}`}
          >
            <option value="">-- Seleccione un perfil --</option>

            {perfiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.perfil}
              </option>
            ))}
          </select>
          {errors.perfil && <div className="invalid-feedback">{errors.perfil}</div>}
        </div>

        <button type="submit" className="btn btn-success w-100">
          {id ? 'Actualizar' : 'Guardar'}
        </button>

      </form>
    </div>
  );
};
