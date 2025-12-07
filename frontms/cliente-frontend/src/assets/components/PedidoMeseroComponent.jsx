import React, { useEffect, useState, useCallback } from 'react';
import { listPedidos } from '../../services/PedidoService'; // Para obtener la lista completa o la que necesitemos filtrar
import { listReservas } from '../../services/ReservarService';
import { listAtender } from '../../services/AtenderService'; // Usaremos esta para filtrar por idEmpleado
import { getCliente } from '../../services/ClienteService'; 
import { getProducto } from '../../services/ProductoService';
import { getEmpleado, buscarEmpleadoPorIdUsuario } from '../../services/EmpleadoService'; // Función clave
import { listDetalles } from '../../services/DetalleService';
import { useNavigate } from 'react-router-dom';

// Colores de la marca "Plate & Co."
const primaryColor = "#1A237E";
const accentColor = "#FF5722";
const neutralColor = "#f2f2f2";

// ----------------------------------------------------
// HOOKS (Reutilizados del ListPedidoComponent)
// ----------------------------------------------------

// Hook para obtener nombre del cliente
const useClienteNombre = (idCliente) => {
    const [nombre, setNombre] = useState('Cargando...');
    useEffect(() => {
        if (idCliente) {
            getCliente(idCliente)
                .then(res => {
                    const c = res.data;
                    setNombre((c.nombreCliente || c.nombre || `Cliente ID ${idCliente}`).trim());
                })
                .catch(() => setNombre(`Cliente ID ${idCliente} (Error)`));
        } else {
            setNombre('Cliente no asignado');
        }
    }, [idCliente]);
    return nombre;
};

// Hook para obtener nombre del producto
const useProductoNombre = (idProducto) => {
    const [nombre, setNombre] = useState('Cargando...');
    useEffect(() => {
        if (idProducto) {
            getProducto(idProducto)
                .then(res => {
                    const p = res.data;
                    setNombre((p.nombreProducto || p.nombre || `Producto ID ${idProducto}`).trim());
                })
                .catch(() => setNombre(`Producto ID ${idProducto} (Error)`));
        } else {
            setNombre('Producto no asignado');
        }
    }, [idProducto]);
    return nombre;
};

// Hook para obtener nombre del empleado (mesero)
const useEmpleadoNombre = (idEmpleado) => {
    const [nombre, setNombre] = useState('Cargando...');
    useEffect(() => {
        if (idEmpleado) {
            getEmpleado(idEmpleado)
                .then(res => {
                    const e = res.data;
                    setNombre((e.nombreEmpleado || e.nombre || `Empleado ID ${idEmpleado}`).trim());
                })
                .catch(() => setNombre(`Empleado ID ${idEmpleado} (Error)`));
        } else {
            setNombre('Mesero no asignado');
        }
    }, [idEmpleado]);
    return nombre;
};

// Tarjeta de cada producto (Reutilizada)
const DetalleProductoCard = ({ detalle }) => {
    const nombreProducto = useProductoNombre(detalle.idProducto);
    return (
        <div style={{
            border: `1px solid ${neutralColor}`,
            borderRadius: '6px',
            padding: '8px',
            backgroundColor: '#ffffff',
            marginBottom: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
            <p><b>Producto:</b> {nombreProducto}</p>
            <p><b>Cantidad:</b> {detalle.cantidad}</p>
            <p><b>Subtotal:</b> <span style={{ color: primaryColor }}>${detalle.subtotal}</span></p>
        </div>
    );
};

// ----------------------------------------------------
// Tarjeta de Pedido (Adaptada)
// ----------------------------------------------------

const PedidoMeseroCard = ({ pedido, reservas, idEmpleadoAutenticado }) => {
    const clienteNombre = useClienteNombre(pedido.idCliente);
    const atencion = pedido.atenciones.find(a => a.idEmpleado === idEmpleadoAutenticado);
    const meseroNombre = useEmpleadoNombre(atencion?.idEmpleado);
    
    // Nueva funcion para descargar el PDF
    const handleImprimirTicket = () => {
        const url = `api/pedido/${pedido.idPedido}/ticket`;
        window.open(url, '_blank');
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '20px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <h4 style={{ color: primaryColor, borderBottom: `2px solid ${neutralColor}`, paddingBottom: '10px', marginBottom: '15px' }}>
                Pedido #{pedido.idPedido} 🧾
            </h4>

            <p><b>Cliente:</b> {clienteNombre} 👤</p>
            <p><b>Mesero Asignado:</b> {meseroNombre} (Tú) ✅</p>

            {pedido.idReserva ? (
                <p><b>Reserva:</b> #{pedido.idReserva}</p>
            ) : (
                <p style={{ fontStyle: 'italic', color: '#666' }}>Sin reserva asignada</p>
            )}

           {pedido.fecha && (
                        <p style={{ margin: 0, color: '#666' }}>
                            Fecha: {pedido.fecha} 
                             {/* ^^^^ CAMBIO: ELIMINAMOS new Date() porque pedido.fecha ya es un string formateado */}
                        </p>
                    )}
                     {pedido.hora ? (
                        <p style={{ margin: 0, color: '#666' }}>
                            Hora: {pedido.hora}
                        </p>
                    ) : (
                <p style={{ fontStyle: 'italic', color: '#666' }}>Hora no registrada</p>
            )}

            <div style={{ marginTop: '15px', flexGrow: 1 }}>
                <p style={{ fontWeight: 'bold', borderBottom: `1px dotted ${neutralColor}`, paddingBottom: '5px' }}>
                    Productos Solicitados:
                </p>
                {pedido.detalles?.length ? (
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {pedido.detalles.map((d, idx) => <DetalleProductoCard key={idx} detalle={d} />)}
                    </div>
                ) : (
                    <p style={{ fontStyle: 'italic', color: '#666' }}>Sin productos en este pedido.</p>
                )}
            </div>

            <p style={{ fontSize: '1.2em', fontWeight: 'bold', marginTop: '10px' }}>
                Total: <span style={{ color: accentColor }}>${pedido.total}</span>
            </p>

            {/* Botón para imprimir el ticket en PDF */}
            <button
                onClick={handleImprimirTicket}
                style={{
                    backgroundColor: primaryColor,
                    color: "#fff",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginTop: "10px",
                    transition: "background-color 0.3s",
                }}
            >
                🧾 Imprimir Ticket
            </button>
        </div>
    );
};


// ----------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------

export const PedidoMeseroComponent = () => {
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [atender, setAtender] = useState([]);
    const [idEmpleado, setIdEmpleado] = useState(null); // ID del mesero logueado
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // 1. Obtener ID de Empleado y cargar datos base
    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            // 1.1 Obtener ID de Usuario y Puesto
            const storedUser = JSON.parse(localStorage.getItem("usuario"));
            const idUsuario = storedUser?.id || storedUser?.idUsuario || storedUser?.idusuario; 
            const puesto = storedUser?.puesto || storedUser?.perfil?.perfil;

            if (!idUsuario || puesto !== "Mesero") {
                setError('Acceso denegado: Debes iniciar sesión como Mesero.');
                setCargando(false);
                return;
            }

            // 1.2 Obtener ID de Empleado a partir del ID de Usuario
            const empleadoRes = await buscarEmpleadoPorIdUsuario(idUsuario);
            const idEmpleadoAutenticado = empleadoRes.data.idEmpleado;

            if (!idEmpleadoAutenticado) {
                setError('No se encontró un perfil de Empleado asociado a tu cuenta.');
                setCargando(false);
                return;
            }

            setIdEmpleado(idEmpleadoAutenticado);

            // 1.3 Cargar todos los datos base
            const [pedidosRes, reservasRes, detallesRes, atenderRes] = await Promise.all([
                listPedidos(),
                listReservas(),
                listDetalles(),
                listAtender()
            ]);

            const pedidosData = pedidosRes.data;
            const reservasData = reservasRes.data;
            const detallesData = detallesRes.data;
            const atenderData = atenderRes.data;

            setReservas(reservasData);
            setAtender(atenderData);
            
            // 2. FILTRADO Y Mapeo
            // Mapeo de Detalle a Pedido
            const detallesPorPedido = detallesData.reduce((acc, det) => {
                const id = det.idPedido;
                if (!acc[id]) acc[id] = [];
                acc[id].push(det);
                return acc;
            }, {});

            // Mapeo de Atender a Pedido
            const atencionesPorPedido = atenderData.reduce((acc, at) => {
                const id = at.idPedido;
                if (!acc[id]) acc[id] = [];
                acc[id].push(at);
                return acc;
            }, {});
// 3. Filtrar los pedidos que pertenecen a este empleado
            const pedidosRelacionados = pedidosData
                .filter(p => {
                    const atenciones = atencionesPorPedido[p.idPedido] || [];
                    return atenciones.some(a => a.idEmpleado === idEmpleadoAutenticado);
                })
                .map(p => {
                    // Calculamos la fecha/hora más reciente del detalle
                    const detalles = detallesPorPedido[p.idPedido] || [];
                    const fechaMasReciente = detalles.reduce((maxDate, det) => {
                        // Creamos el objeto Date directamente del string de tu microservicio (Ej: "2025-11-24T18:30:00")
                        const current = new Date(det.fechaHora); 
                        return current > maxDate ? current : maxDate;
                    }, new Date(0));
                    
                    // --- INICIO DE CAMBIOS ---
                    const fechaISO = fechaMasReciente.toISOString();
                    const fechaSolo = fechaISO.substring(0, 10); // YYYY-MM-DD
                    const horaSolo = fechaISO.substring(11, 16); // HH:MM
                    
                    return {
                        ...p,
                        detalles: detalles,
                        atenciones: atencionesPorPedido[p.idPedido] || [],
                        
                        // Nuevo campo que usa el formato ISO para ordenar
                        fechaOrdenamiento: fechaISO, 
                        
                        // Mantenemos 'fecha' y 'hora' para la visualización formateada
                        fecha: fechaMasReciente.toLocaleDateString(), 
                        hora: horaSolo // Usamos HH:MM
                    };
                })
                // --- FIN DE CAMBIOS ---
                
                // 4. Ordenamiento usando la fecha ISO universal
                .sort((a, b) => new Date(b.fechaOrdenamiento) - new Date(a.fechaOrdenamiento)); // Ordenar por fecha de creación

            setPedidosFiltrados(pedidosRelacionados);
            
        } catch (err) {
            console.error("Error al cargar datos del mesero:", err);
            setError('Error al obtener tus pedidos. Verifica la conexión con los microservicios.');
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    if (error) {
        return <div className="alert alert-danger" style={{ margin: '20px' }}>{error}</div>;
    }

    if (cargando) {
        return <div className="alert alert-info" style={{ margin: '20px' }}>Cargando tus pedidos...</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
            }}>
                <h2 style={{ color: primaryColor }}>Mis Pedidos Asignados 👨‍🍳</h2>
                <button
                    onClick={cargarDatos}
                    style={{
                        backgroundColor: primaryColor,
                        color: "#fff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🔄 Recargar Pedidos
                </button>
            </div>

            {/* Listado de pedidos */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '20px'
            }}>
                {pedidosFiltrados.length > 0 ? (
                    pedidosFiltrados.map((pedido) => (
                        <PedidoMeseroCard 
                            key={pedido.idPedido} 
                            pedido={pedido} 
                            reservas={reservas} 
                            idEmpleadoAutenticado={idEmpleado}
                        />
                    ))
                ) : (
                    <div style={{ 
                        textAlign: "center", 
                        gridColumn: '1 / -1', 
                        padding: '40px', 
                        backgroundColor: neutralColor, 
                        borderRadius: '10px' 
                    }}>
                        <p style={{ fontSize: '1.2em', margin: 0 }}>
                            🎉 ¡Excelente! No tienes pedidos pendientes o asignados en este momento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PedidoMeseroComponent;