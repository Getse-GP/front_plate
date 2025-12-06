import React, { useEffect, useState } from 'react';
import { listProductos } from '../../services/ProductoService';
import { listTipos } from '../../services/TipoService';

export const ProductoClienteComponent = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);
  const [filtroEstatus, setFiltroEstatus] = useState('Todos');

  useEffect(() => {
    getAllProductos();
    getAllTipos();
  }, []);

  const getAllProductos = () => {
    listProductos()
      .then((res) => setProductos(res.data))
      .catch(() => setError('No se pudieron cargar los productos.'));
  };

  const getAllTipos = () => {
    listTipos()
      .then((res) => setTipos(res.data))
      .catch(() => console.error('No se pudieron cargar los tipos'));
  };

  const productosFiltrados = productos.filter((p) => {
    if (filtroEstatus === 'Todos') return true;
    return p.estatus === filtroEstatus;
  });

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
      <h2 className="text-center mb-4">Productos Disponibles</h2>

      {/* FILTRO DE ESTATUS */}
      <div className="mb-3 d-flex align-items-center">
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

      {/* TABLA DE PRODUCTOS */}
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
                        src={`imagenes/${producto.fotoProductoNombre}`}
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
                  <td>{producto.estatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-muted py-3">
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

export default ProductoClienteComponent;
