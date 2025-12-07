import React, { useEffect, useState } from 'react';
import {
  deleteProducto,
  listProductos,
  updateEstatusProducto,
  buscarPorNombre,
  buscarPorTipo,
  buscarPorRangoPrecio,
} from '../../services/ProductoService';
import { listTipos } from '../../services/TipoService'; // <-- Servicio para traer tipos
import { useNavigate } from 'react-router-dom';

export const ListProductoComponent = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]); // <-- Lista de tipos
  const [error, setError] = useState(null);
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');
  const [busqueda, setBusqueda] = useState('nombre');
  const [nombre, setNombre] = useState('');
  const [idTipo, setIdTipo] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const [rol, setRol] = useState(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario?.perfil || '';
  });

  const navegar = useNavigate();

  useEffect(() => {
    getAllProductos();
    getAllTipos();
  }, []);

  const getAllProductos = () => {
    listProductos()
      .then((response) => setProductos(response.data))
      .catch(() => setError('No se pudieron cargar los productos.'));
  };

  const getAllTipos = () => {
    listTipos()
      .then((res) => setTipos(res.data))
      .catch(() => console.error('No se pudieron cargar los tipos'));
  };

  const nuevoProducto = () => navegar('/producto/nuevo');
  const actualizarProducto = (id) => navegar(`/producto/edita/${id}`);

  const eliminarProducto = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
      deleteProducto(id)
        .then(() => getAllProductos())
        .catch(() => alert('Error al eliminar producto.'));
    }
  };

  const cambiarEstatus = (idProducto, nuevoEstatus) => {
    updateEstatusProducto(idProducto, nuevoEstatus)
      .then(() => {
        setProductos((prev) =>
          prev.map((p) =>
            p.idProducto === idProducto ? { ...p, estatus: nuevoEstatus } : p
          )
        );
      })
      .catch(() => alert('No se pudo cambiar el estatus.'));
  };

  const handleBuscar = () => {
    if (busqueda === 'nombre' && nombre.trim() !== '') {
      buscarPorNombre(nombre).then((res) => setProductos(res.data));
    } else if (busqueda === 'tipo' && idTipo.trim() !== '') {
      buscarPorTipo(idTipo).then((res) => setProductos(res.data));
    } else if (busqueda === 'precio') {
      buscarPorRangoPrecio(precioMin || null, precioMax || null).then((res) =>
        setProductos(res.data)
      );
    } else {
      getAllProductos();
    }
  };

  const productosFiltrados = productos.filter((p) => {
    if (filtroEstatus === 'Todos') return true;
    return p.estatus === filtroEstatus;
  });

  // Función para obtener el nombre del tipo según idTipo
 const getTipoNombre = (idTipo) => {
  const tipoObj = tipos.find(
    (t) =>
      t.id_tipo === idTipo ||    // si viene de SQL directo
      t.idTipo === idTipo        // si viene mapeado desde Java
  );

  return tipoObj ? tipoObj.tipo : "Sin tipo";
};

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Registro de Productos</h2>

    {/* FILTROS / NUEVO PRODUCTO */}
<div className="mb-4 p-3 shadow-sm border rounded">

  {/* 1. Primera fila: botón y estatus */}
  <div className="d-flex justify-content-between align-items-center mb-3">
    <button
      className="btn btn-primary"
      onClick={nuevoProducto}
      disabled={rol === 'Cliente'}
      style={rol === 'Cliente' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
    >
      Nuevo Producto
    </button>

    <div>
      <label className="me-2 fw-bold">Filtrar por estatus:</label>
      <select
        className="form-select d-inline-block w-auto"
        value={filtroEstatus}
        onChange={(e) => setFiltroEstatus(e.target.value)}
      >
        <option value="Todos">Todos</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
      </select>
    </div>
  </div>

  {/* 2. Selección del tipo de búsqueda */}
  <div className="row mb-3">
    <div className="col-md-4">
      <label className="form-label fw-bold">Buscar por:</label>
      <select
        className="form-select"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      >
        <option value="nombre">Nombre</option>
        <option value="tipo">Tipo</option>
        <option value="precio">Rango de Precio</option>
      </select>
    </div>
  </div>

  {/* 3. Campo por nombre */}
  {busqueda === "nombre" && (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Nombre del producto:</label>
        <input
          type="text"
          className="form-control"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Coca Cola"
        />
      </div>
    </div>
  )}

  {/* 4. Campo por tipo */}
  {busqueda === "tipo" && (
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label">Tipo:</label>
        <select
          className="form-select"
          value={idTipo}
          onChange={(e) => setIdTipo(e.target.value)}
        >
          <option value="">Seleccione un tipo</option>
          {tipos.map((t) => (
            <option key={t.idTipo} value={t.idTipo}>
              {t.tipo}
            </option>
          ))}
        </select>
      </div>
    </div>
  )}

  {/* 5. Campos por precio */}
  {busqueda === "precio" && (
    <div className="row mb-3">
      <div className="col-md-3">
        <label className="form-label">Precio mínimo:</label>
        <input
          type="number"
          className="form-control"
          value={precioMin}
          onChange={(e) => setPrecioMin(e.target.value)}
        />
      </div>

      <div className="col-md-3">
        <label className="form-label">Precio máximo:</label>
        <input
          type="number"
          className="form-control"
          value={precioMax}
          onChange={(e) => setPrecioMax(e.target.value)}
        />
      </div>
    </div>
  )}

  {/* 6. Botón buscar */}
  <button className="btn btn-primary mt-2" onClick={handleBuscar}>
    Buscar
  </button>

</div>


      {/* TABLA */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre del Producto</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Tipo</th>
              <th>Imagen</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <tr key={producto.idProducto}>
                  <td>{producto.idProducto}</td>
                  <td>{producto.nombreProducto}</td>
                  <td>{producto.descripcionP}</td>
                  <td>${producto.precioP}</td>
                  <td>{getTipoNombre(producto.idTipo)}</td>

                  <td style={{ textAlign: 'center' }}>
                    {producto.fotoProductoNombre ? (
                      <img
                        src={`/imagenes/${producto.fotoProductoNombre}`}
                        alt={producto.nombreProducto}
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                        }}
                      />
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={producto.estatus}
                      className={`form-select form-select-sm ${
                        producto.estatus === 'Activo'
                          ? 'bg-success text-white'
                          : 'bg-secondary text-white'
                      }`}
                      onChange={(e) =>
                        cambiarEstatus(producto.idProducto, e.target.value)
                      }
                      disabled={rol === 'Cliente'}
                      style={rol === 'Cliente' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => actualizarProducto(producto.idProducto)}
                      disabled={rol === 'Cliente'}
                      style={rol === 'Cliente' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      Actualizar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(producto.idProducto)}
                      disabled={rol === 'Cliente'}
                      style={rol === 'Cliente' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted py-3">
                  No hay productos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
