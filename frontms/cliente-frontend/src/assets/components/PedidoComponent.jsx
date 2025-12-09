import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listClientes } from '../../services/ClienteService';
import { listProductos } from '../../services/ProductoService';
import { listEmpleados } from '../../services/EmpleadoService';
import { listReservas } from '../../services/ReservarService';
import { crearPedido, getPedido, updatePedido } from '../../services/PedidoService';
import { crearAtender, getAtender } from '../../services/AtenderService';
import { AtenderComponent } from '../../assets/components/AtenderComponent.jsx';

export const PedidoComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idCliente, setIdCliente] = useState('');
  const [idEmpleado, setIdEmpleado] = useState('');
  const [idReserva, setIdReserva] = useState('');
  const [detalles, setDetalles] = useState([{ idProducto: '', cantidad: 1 }]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]); // 👈 reservas por cliente
  const [errors, setErrors] = useState({});
  const [subtotalPorDetalle, setSubtotalPorDetalle] = useState([0]);
  const [totalVisual, setTotalVisual] = useState(0);

  // -------------------- Carga inicial --------------------
  useEffect(() => {
    listClientes().then(res => setClientes(res.data)).catch(err => console.error(err));
    listProductos().then(res => setProductos(res.data.filter(p => p.estatus === 'Activo' || p.estatus === true)))
                   .catch(err => console.error(err));
    listEmpleados().then(res => setEmpleados(res.data.filter(emp => emp.puesto?.toLowerCase() === 'mesero')))
                   .catch(err => console.error(err));
    listReservas()
      .then(res => setReservas(res.data.filter(r => r.estatus?.toLowerCase() === "pendiente")))
      .catch(err => console.error(err));
  }, []);

  // -------------------- Filtrar reservas según cliente --------------------
  useEffect(() => {
    if (!idCliente) {
      setReservasFiltradas([]);
      setIdReserva('');
      return;
    }

    const filtradas = reservas.filter(r => parseInt(r.idCliente) === parseInt(idCliente));
    setReservasFiltradas(filtradas);
    setIdReserva(''); // limpiar selección anterior
  }, [idCliente, reservas]);

  // -------------------- Carga del pedido si editando --------------------
  useEffect(() => {
    if (!id) return;
    getPedido(id)
      .then(res => {
        const pedido = res.data;
        setIdCliente(pedido.idCliente);
        setIdReserva(pedido.idReserva || '');
        const detallesPedido = pedido.detalles.map(d => ({ idProducto: d.idProducto, cantidad: d.cantidad }));
        setDetalles(detallesPedido);

        const inicialSubtotales = detallesPedido.map(d => {
          const prod = productos.find(p => p.idProducto === d.idProducto);
          return prod ? Number(prod.precioP) * Number(d.cantidad) : 0;
        });
        setSubtotalPorDetalle(inicialSubtotales);
        setTotalVisual(inicialSubtotales.reduce((acc, val) => acc + val, 0));

        getAtender(id)
          .then(resAt => { if(resAt?.data) setIdEmpleado(resAt.data.idEmpleado); })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [id, productos]);

  // -------------------- Manejo de detalles --------------------
  const agregarDetalle = () => {
    setDetalles([...detalles, { idProducto: '', cantidad: 1 }]);
    setSubtotalPorDetalle([...subtotalPorDetalle, 0]);
  };

  const eliminarDetalle = (index) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
    const nuevosSubtotales = subtotalPorDetalle.filter((_, i) => i !== index);
    setSubtotalPorDetalle(nuevosSubtotales);
    setTotalVisual(nuevosSubtotales.reduce((acc, val) => acc + (val || 0), 0));
  };

  const actualizarDetalle = (index, campo, valor) => {
    const nuevosDetalles = [...detalles];
    nuevosDetalles[index][campo] = valor;
    setDetalles(nuevosDetalles);
    actualizarSubtotal(index, nuevosDetalles[index]);
  };

  const actualizarSubtotal = (index, detalle) => {
    const producto = productos.find(p => p.idProducto === parseInt(detalle.idProducto));
    const subtotal = producto ? Number(producto.precioP) * Number(detalle.cantidad) : 0;
    const nuevosSubtotales = [...subtotalPorDetalle];
    nuevosSubtotales[index] = subtotal;
    setSubtotalPorDetalle(nuevosSubtotales);
    setTotalVisual(nuevosSubtotales.reduce((acc, val) => acc + (val || 0), 0));
  };

  // -------------------- Validación --------------------
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!idCliente) nuevosErrores.idCliente = 'Debe seleccionar un cliente';
    if (!idEmpleado) nuevosErrores.idEmpleado = 'Debe seleccionar un mesero';
    detalles.forEach((d, i) => {
      if (!d.idProducto) nuevosErrores[`producto_${i}`] = 'Debe seleccionar un producto';
      if (!d.cantidad || d.cantidad <= 0) nuevosErrores[`cantidad_${i}`] = 'Cantidad inválida';
    });
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // -------------------- Guardar pedido --------------------
  const savePedido = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const pedidoData = {
      idCliente: parseInt(idCliente),
      idEmpleado: parseInt(idEmpleado),
      total: 0,
      detalles: detalles.map(d => ({
        idProducto: parseInt(d.idProducto),
        cantidad: parseInt(d.cantidad)
      })),
      ...(idReserva && { idReserva: parseInt(idReserva) })
    };

    try {
      if (id) {
        await updatePedido(id, pedidoData);
        alert('✅ Pedido actualizado correctamente');
      } else {
        const res = await crearPedido(pedidoData);
        const nuevoPedido = res.data;
        await crearAtender({ idPedido: nuevoPedido.idPedido, idEmpleado: parseInt(idEmpleado) });
        alert('✅ Pedido creado correctamente');
      }
      navigate('/pedido/lista');
    } catch (err) {
      console.error(err);
      alert('⚠️ Error al guardar pedido');
    }
  };

  // -------------------- Render --------------------
  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 className="text-center mb-4">{id ? 'Editar Pedido' : 'Registro de Pedido'}</h2>
      <form onSubmit={savePedido}>
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
                {c.nombreCliente || c.nombre}
              </option>
            ))}
          </select>
          {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
        </div>

        {/* Reserva */}
        <div className="mb-3">
          <label>Reserva (opcional):</label>
          <select
            value={idReserva}
            onChange={(e) => setIdReserva(e.target.value)}
            className="form-control"
            disabled={!reservasFiltradas.length}
          >
            <option value="">-- Sin reserva --</option>
            {reservasFiltradas.length > 0 ? (
              reservasFiltradas.map(r => {
                const mesa = r.mesa || {};
                return (
                  <option key={r.idReserva} value={r.idReserva}>
                    {`#${r.idReserva} - ${r.fecha || 'Sin fecha'} ${r.hora || ''} - Mesa ${mesa.numero || r.idMesa}`}
                  </option>
                );
              })
            ) : (
              idCliente && <option value="">Este cliente no tiene reservas activas</option>
            )}
          </select>
        </div>

        {/* Mesero */}
        <AtenderComponent
          empleados={empleados}
          idEmpleado={idEmpleado}
          setIdEmpleado={setIdEmpleado}
          error={errors.idEmpleado}
        />

        {/* Detalles */}
        <h5>Productos del pedido:</h5>
        {detalles.map((d, i) => (
          <div key={i} className="d-flex flex-column mb-2 gap-1">
            <div className="d-flex align-items-center gap-2">
              <select
                value={d.idProducto}
                onChange={(e) => actualizarDetalle(i, 'idProducto', e.target.value)}
                className={`form-control ${errors[`producto_${i}`] ? 'is-invalid' : ''}`}
              >
                <option value="">-- Producto --</option>
                {productos.map(p => (
                  <option key={p.idProducto} value={p.idProducto}>
                    {p.nombreProducto}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={d.cantidad}
                min="1"
                onChange={(e) => actualizarDetalle(i, 'cantidad', e.target.value)}
                className={`form-control ${errors[`cantidad_${i}`] ? 'is-invalid' : ''}`}
                style={{ width: '100px' }}
              />

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => eliminarDetalle(i)}
                disabled={detalles.length === 1}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: '0.9em', color: '#555' }}>
              Subtotal: ${subtotalPorDetalle[i] || 0}
            </div>
          </div>
        ))}

        <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '15px' }}>
          Total: ${totalVisual}
        </div>

        <button type="button" className="btn btn-secondary mb-3" onClick={agregarDetalle}>+ Agregar producto</button>
        <button type="submit" className="btn btn-success w-100">{id ? 'Actualizar Pedido' : 'Guardar Pedido'}</button>
      </form>
    </div>
  );
};
