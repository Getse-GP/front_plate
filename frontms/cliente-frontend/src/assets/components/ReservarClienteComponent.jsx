import React, { useState, useEffect } from 'react';
import { crearReserva, getReserva, updateReserva } from '../../services/ReservarService';
// Solo necesitamos la función para buscar al cliente autenticado
import { buscarClientePorIdUsuario } from '../../services/ClienteService'; 
import { listMesas } from '../../services/MesaService';
import { useNavigate, useParams } from 'react-router-dom';

export const ReservarClienteComponent = () => {
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [idCliente, setIdCliente] = useState('');
    // Estado para guardar el objeto Cliente (para mostrar su nombre)
    const [clienteAutenticado, setClienteAutenticado] = useState(null); 
    const [idMesa, setIdMesa] = useState('');
    const [mesas, setMesas] = useState([]); 
    const [errors, setErrors] = useState({});
    // Estado para manejar errores de autenticación o carga inicial
    const [authError, setAuthError] = useState(null); 
    
    const { id } = useParams();
    const navigate = useNavigate();

    // ----------------------------------------------------
    // 1. Detección y Carga del Cliente Autenticado y Mesas
    // ----------------------------------------------------
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("usuario"));
        // Se extrae el ID de usuario del almacenamiento local
        const idUsuario = storedUser?.id || storedUser?.idUsuario || storedUser?.idusuario; 
        const perfil = storedUser?.perfil?.perfil;

        if (!idUsuario || perfil !== "Cliente") {
            // Si no está logueado o no es cliente, mostramos error
            setAuthError('Acceso denegado: Debes iniciar sesión como Cliente para hacer una reserva.');
            return;
        }

        // Si estamos creando una nueva reserva (id es null)
        if (!id) {
            buscarClientePorIdUsuario(idUsuario)
                .then(res => {
                    const clienteData = res.data;
                    const idClienteAutenticado = clienteData.idcliente;

                    if (idClienteAutenticado) {
                        // 🔑 Establecer el ID del cliente logueado
                        setIdCliente(idClienteAutenticado); 
                        // Guardar los datos para mostrar el nombre
                        setClienteAutenticado(clienteData);
                        setAuthError(null);
                    } else {
                        setAuthError('Error: No se encontró un perfil de Cliente asociado a tu cuenta.');
                    }
                })
                .catch(err => {
                    console.error("Error al buscar cliente por usuario ID:", err);
                    setAuthError('Error de comunicación al verificar tu cuenta de cliente.');
                });
        }
        
        // Cargar mesas siempre
        listMesas()
            .then(res => setMesas(res.data))
            .catch(err => console.error('Error al cargar mesas:', err));

    }, [id]);

    // ----------------------------------------------------
    // 2. Cargar reserva si estamos editando
    // ----------------------------------------------------
    useEffect(() => {
        if (id) {
            getReserva(id)
                .then(res => {
                    const r = res.data;
                    setFecha(r.fecha || '');
                    setHora(r.hora || '');
                    setIdMesa(r.idMesa || '');

                    // Al editar, se carga el idCliente que ya existe en la reserva
                    if (r.idCliente) {
                        setIdCliente(r.idCliente);
                    }
                })
                .catch(err => console.error('Error al obtener reserva:', err));
        }
    }, [id]);

    // ----------------------------------------------------
    // 3. Validación y Guardado
    // ----------------------------------------------------

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
            errorsCopy.idCliente = 'Error: ID de cliente no detectado. Vuelva a iniciar sesión.';
            valido = false;
        }
        if (!idMesa) {
            errorsCopy.idMesa = 'Debe seleccionar una mesa';
            valido = false;
        }

        setErrors(errorsCopy);
        return valido;
    };

    const saveReserva = (e) => {
        e.preventDefault();
        if (!validaForm()) return;

        const data = {
            fecha,
            hora,
            // Aseguramos que se envíe el ID del cliente detectado/cargado
            idCliente: Number(idCliente), 
            idMesa: Number(idMesa),
            // Las nuevas reservas inician en PENDIENTE por defecto
            estatus: id ? undefined : 'PENDIENTE' 
        };

        if (id) {
            updateReserva(id, data)
                .then(() => navigate('/misreservas', { replace: true }))
                .catch(err => console.error('Error al actualizar reserva:', err));
        } else {
            crearReserva(data)
                .then(() => navigate('/misreservas', { replace: true }))
                .catch(err => console.error('Error al crear reserva:', err));
        }
    };

    const titulo = id ? 'Modificar Mi Reserva' : 'Registrar Nueva Reserva';

    // Manejo de estados de carga y error
    if (authError) {
        return <div className="alert alert-danger text-center mt-5">{authError}</div>;
    }

    if (!idCliente && !id) {
        return <div className="alert alert-info text-center mt-5">Cargando datos del cliente...</div>;
    }


    // ----------------------------------------------------
    // 4. Renderizado
    // ----------------------------------------------------

    return (
        <div className="container mt-5">
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h2 className="text-center mb-4">{titulo} 🍽️</h2>

                <form onSubmit={saveReserva}>
                    
                    {/* Campo Cliente (Solo Lectura/Deshabilitado) */}
                    <div className="mb-4 p-3 bg-light rounded border">
                        <label className="fw-bold">Reserva a nombre de:</label>
                        <input
                            type="text"
                            // Muestra el nombre si ya está cargado, o el ID si estamos editando
                            value={clienteAutenticado ? clienteAutenticado.nombreCliente : `Cliente ID: ${idCliente}`}
                            className="form-control mt-1"
                            disabled
                            readOnly
                        />
                        {/* Campo oculto para enviar el IDCliente en el submit */}
                        <input type="hidden" value={idCliente} name="idCliente" />
                    </div>

                    {/* Fecha */}
                    <div className="mb-3">
                        <label className="form-label">Fecha:</label>
                        <input
                            type="date"
                            value={fecha}
                            min={new Date().toISOString().split('T')[0]} 
                            onChange={(e) => setFecha(e.target.value)}
                            className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                        />
                        {errors.fecha && <div className="invalid-feedback">{errors.fecha}</div>}
                    </div>

                    {/* Hora */}
                    <div className="mb-3">
                        <label className="form-label">Hora:</label>
                        <input
                            type="time"
                            value={hora}
                            onChange={(e) => setHora(e.target.value)}
                            className={`form-control ${errors.hora ? 'is-invalid' : ''}`}
                        />
                        {errors.hora && <div className="invalid-feedback">{errors.hora}</div>}
                    </div>

                    {/* Mesa */}
                    <div className="mb-4">
                        <label className="form-label">Mesa (Capacidad):</label>
                        <select
                            value={idMesa}
                            onChange={(e) => setIdMesa(e.target.value)}
                            className={`form-control ${errors.idMesa ? 'is-invalid' : ''}`}
                        >
                            <option value="">-- Seleccione una mesa --</option>
                            {mesas
                                // Filtramos mesas ocupadas, pero si estamos editando, permitimos ver la mesa que ya tiene la reserva
                                .filter(m => m.estatus !== 'Ocupado' || m.idMesa === Number(idMesa)) 
                                .map(m => (
                                    <option key={m.idMesa} value={m.idMesa}>
                                        {`Mesa ${m.numero} - ${m.ubicacion} (${m.capacidad} personas)`}
                                    </option>
                                ))
                            }
                        </select>
                        {errors.idMesa && <div className="invalid-feedback">{errors.idMesa}</div>}
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/misreservas')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-success">
                            {id ? 'Actualizar Reserva' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};