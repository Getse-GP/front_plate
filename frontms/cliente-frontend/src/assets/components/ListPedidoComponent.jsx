import React, { useEffect, useState } from 'react';
import { listPedidos, buscarPedidosPorFecha } from '../../services/PedidoService';
import { listReservas } from '../../services/ReservarService';
import { getCliente } from '../../services/ClienteService'; 
import { getProducto } from '../../services/ProductoService';
import { getEmpleado } from '../../services/EmpleadoService';
import { listDetalles } from '../../services/DetalleService';
import { listAtender } from '../../services/AtenderService';
import { useNavigate } from 'react-router-dom';

//Colores de la marca "Plate & Co."
const primaryColor = "#1A237E";
const accentColor = "#FF5722";
const neutralColor = "#f2f2f2";

//Hook para obtener nombre del cliente
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

//Hook para obtener nombre del producto
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

//Hook para obtener nombre del empleado (mesero)
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

//Tarjeta de cada producto
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

//Tarjeta de pedido
const PedidoCard = ({ pedido, reservas, atender }) => {
  const clienteNombre = useClienteNombre(pedido.idCliente);
  const reserva = reservas.find(r => r.idReserva === pedido.idReserva);
  const atencion = atender.find(a => a.idPedido === pedido.idPedido);
  const meseroNombre = useEmpleadoNombre(atencion?.idEmpleado);

  //Nueva funcion para descargar el PDF
  const handleImprimirTicket = () => {
    const url = `/api/pedido/${pedido.idPedido}/ticket`;
    window.open(url, '_blank'); // Abre el PDF en una nueva pestaña
  };

  const [fechaFiltro, setFechaFiltro] = useState('');
const [modoFiltro, setModoFiltro] = useState(false); // para volver al listado completo

//buscar pedido por fecha
const buscarPorFecha = async () => {
  if (!fechaFiltro) return alert("Selecciona una fecha");
  try {
    const res = await buscarPedidosPorFecha(fechaFiltro);
    const pedidosData = res.data;

    if (pedidosData.length === 0) {
      alert("No se encontraron pedidos para esa fecha");
      return;
    }

    setPedidos(pedidosData);
    setModoFiltro(true);
  } catch (error) {
    console.error("Error al buscar pedidos por fecha:", error);
  }
};

const limpiarFiltro = () => {
  setFechaFiltro('');
  setModoFiltro(false);
  cargarDatos();
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
        Pedido #{pedido.idPedido}
      </h4>

      <p><b>Cliente:</b> {clienteNombre} 👤</p>
      <p><b>Mesero:</b> {meseroNombre} 🍽️</p>

      {pedido.idReserva ? (
        <p><b>Reserva:</b> #{pedido.idReserva}</p>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#666' }}>Sin reserva asignada</p>
      )}

      {pedido.fecha && (
        <p style={{ margin: 0, color: '#666' }}>
          Fecha: {new Date(pedido.fecha).toLocaleString()}
        </p>
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

      {/* 👉 Botón para imprimir el ticket en PDF */}
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
        onMouseOver={(e) => (e.target.style.backgroundColor = "#303F9F")}
        onMouseOut={(e) => (e.target.style.backgroundColor = primaryColor)}
      >
        🧾 Imprimir Ticket
      </button>
    </div>
  );
};


//Lista principal
export const ListPedidoComponent = () => {
  const [pedidos, setPedidos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [atender, setAtender] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [modoFiltro, setModoFiltro] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
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

      // Crear un mapa de idPedido -> última fechaHora
      const fechasPorPedido = {};
      detallesData.forEach(det => {
        const id = det.idPedido;
        const fecha = new Date(det.fechaHora);
        if (!fechasPorPedido[id] || fecha > fechasPorPedido[id]) {
          fechasPorPedido[id] = fecha;
        }
      });

      // Agregar fecha al pedido
      const pedidosConFecha = pedidosData.map(p => ({
        ...p,
        fecha: fechasPorPedido[p.idPedido] || null
      }));

      // Ordenar de más reciente a más antiguo
      const pedidosOrdenados = pedidosConFecha.sort((a, b) => {
        const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
        const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
        return fechaB - fechaA;
      });

      setPedidos(pedidosOrdenados);
      setReservas(reservasData);
      setAtender(atenderData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  // 🔎 Buscar por fecha exacta
  const buscarPorFecha = async () => {
    if (!fechaFiltro) return alert("Selecciona una fecha");
    try {
      const res = await buscarPedidosPorFecha(fechaFiltro);
      const pedidosData = res.data;

      if (pedidosData.length === 0) {
        alert("No se encontraron pedidos para esa fecha");
        return;
      }

      setPedidos(pedidosData);
      setModoFiltro(true);
    } catch (error) {
      console.error("Error al buscar pedidos por fecha:", error);
    }
  };

  const limpiarFiltro = () => {
    setFechaFiltro('');
    setModoFiltro(false);
    cargarDatos();
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}>
        <h2 style={{ color: primaryColor }}>Gestión de Pedidos</h2>
        <button
          onClick={() => navigate('/pedido/nuevo')}
          style={{
            backgroundColor: accentColor,
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.3s",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#d3411a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = accentColor)}
        >
          + Nuevo Pedido 🍽️
        </button>
      </div>

      {/* 🔽 Filtro de fecha */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <input
          type="date"
          value={fechaFiltro}
          onChange={(e) => setFechaFiltro(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1em"
          }}
        />
        <button
          onClick={buscarPorFecha}
          style={{
            backgroundColor: primaryColor,
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🔍 Buscar por fecha
        </button>

        {modoFiltro && (
          <button
            onClick={limpiarFiltro}
            style={{
              backgroundColor: "#999",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ↩️ Ver todos
          </button>
        )}
      </div>

      {/*Listado de pedidos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {pedidos.length > 0 ? (
          pedidos.map((pedido) => (
            <PedidoCard key={pedido.idPedido} pedido={pedido} reservas={reservas} atender={atender} />
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: '1 / -1' }}>
            No hay pedidos registrados
          </p>
        )}
      </div>
    </div>
  );
};

export default ListPedidoComponent;
