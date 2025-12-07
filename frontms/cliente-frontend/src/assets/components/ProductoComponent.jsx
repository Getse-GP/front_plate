import React, { useState, useEffect } from 'react';
import { crearProducto, getProducto, updateProducto } from '../../services/ProductoService';
import { listTipos } from '../../services/TipoService';
import { useNavigate, useParams } from 'react-router-dom';

export const ProductoComponent = () => {
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcionP, setDescripcionP] = useState('');
  const [precioP, setPrecioP] = useState('');
  const [idTipo, setIdTipo] = useState('');
  const [estatus, setEstatus] = useState('Activo');
  const [tipos, setTipos] = useState([]);
  const [fotoProducto, setFotoProducto] = useState(null); // nueva variable para la imagen
  const [preview, setPreview] = useState(null); // para mostrar vista previa

  const [errors, setErrors] = useState({
    nombreProducto: '',
    descripcionP: '',
    precioP: '',
    idTipo: '',
  });

  const { id } = useParams();
  const navegar = useNavigate();

  // Cargar tipos disponibles
  useEffect(() => {
     listTipos()
    .then((resp) => {
      if (Array.isArray(resp.data)) {
        setTipos(resp.data);
      } else {
        console.error("Respuesta inválida de tipos:", resp.data);
        setTipos([]);
      }
    })
    .catch((error) => {
      console.error('Error al obtener tipos:', error);
      setTipos([]);
    });
}, []);


  // Cargar producto si estamos en modo edición
  useEffect(() => {
    if (id) {
      getProducto(id)
        .then((response) => {
          const p = response.data;
          setNombreProducto(p.nombreProducto);
          setDescripcionP(p.descripcionP);
          setPrecioP(p.precioP);
          setIdTipo(p.idTipo);
          setEstatus(p.estatus || 'Activo');
          if (p.fotoProductoNombre) {
           setPreview(`/imagenes/${p.fotoProductoNombre}`);
          }
        })
        .catch((error) => console.error('Error al obtener producto:', error));
    }
  }, [id]);

  // Manejar cambio de archivo y generar vista previa
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFotoProducto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Validar formulario
  const validaForm = () => {
    let valido = true;
    const errorsCopy = { ...errors };

    if (!nombreProducto.trim()) {
      errorsCopy.nombreProducto = 'El nombre del producto es requerido';
      valido = false;
    } else errorsCopy.nombreProducto = '';

    if (!descripcionP.trim()) {
      errorsCopy.descripcionP = 'La descripción es requerida';
      valido = false;
    } else errorsCopy.descripcionP = '';

    if (!precioP || Number(precioP) <= 0) {
      errorsCopy.precioP = 'El precio debe ser mayor que 0';
      valido = false;
    } else errorsCopy.precioP = '';

    if (!idTipo) {
      errorsCopy.idTipo = 'Debe seleccionar un tipo de producto';
      valido = false;
    } else errorsCopy.idTipo = '';

    setErrors(errorsCopy);
    return valido;
  };

  // Guardar o actualizar producto
  const saveProducto = (e) => {
    e.preventDefault();
    if (!validaForm()) return;

    const formData = new FormData();
    formData.append('nombreProducto', nombreProducto);
    formData.append('descripcionP', descripcionP);
    formData.append('precioP', precioP);
    formData.append('idTipo', idTipo);
    formData.append('estatus', estatus);
    if (fotoProducto) formData.append('fotoProducto', fotoProducto);

    if (id) {
      updateProducto(id, formData)
        .then((response) => {
          console.log('Producto actualizado:', response.data);
          navegar('/producto/lista', { replace: true });
        })
        .catch((error) => console.error('Error al actualizar producto:', error));
    } else {
      crearProducto(formData)
        .then((response) => {
          console.log('Producto creado:', response.data);
          navegar('/producto/lista', { replace: true });
        })
        .catch((error) => console.error('Error al crear producto:', error));
    }
  };

  const tituloPagina = id ? 'Modificar Producto' : 'Registrar Producto';

  return (
    <div style={{ maxWidth: '550px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2 className="text-center mb-4">{tituloPagina}</h2>

      <form onSubmit={saveProducto} encType="multipart/form-data">
        {/* Nombre */}
        <div className="mb-3">
          <label>Nombre del Producto:</label>
          <input
            type="text"
            value={nombreProducto}
            className={`form-control ${errors.nombreProducto ? 'is-invalid' : ''}`}
            onChange={(e) => setNombreProducto(e.target.value)}
            placeholder="Ej. Pizza, Refresco"
          />
          {errors.nombreProducto && <div className="invalid-feedback">{errors.nombreProducto}</div>}
        </div>

        {/* Descripción */}
        <div className="mb-3">
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcionP}
            className={`form-control ${errors.descripcionP ? 'is-invalid' : ''}`}
            onChange={(e) => setDescripcionP(e.target.value)}
            placeholder="Ej. Grande, Dulce"
          />
          {errors.descripcionP && <div className="invalid-feedback">{errors.descripcionP}</div>}
        </div>

        {/* Precio */}
        <div className="mb-3">
          <label>Precio:</label>
          <input
            type="number"
            value={precioP}
            className={`form-control ${errors.precioP ? 'is-invalid' : ''}`}
            onChange={(e) => setPrecioP(e.target.value)}
            placeholder="Ej. 100"
          />
          {errors.precioP && <div className="invalid-feedback">{errors.precioP}</div>}
        </div>

        {/* Tipo */}
        <div className="mb-3">
          <label>Tipo de Producto:</label>
          <select
            value={idTipo}
            onChange={(e) => setIdTipo(e.target.value)}
            className={`form-control ${errors.idTipo ? 'is-invalid' : ''}`}
          >
            <option value="">-- Seleccione un tipo --</option>
            {tipos.map((tipo) => (
              <option key={tipo.idTipo} value={tipo.idTipo}>
                {tipo.tipo}
              </option>
            ))}
          </select>
          {errors.idTipo && <div className="invalid-feedback">{errors.idTipo}</div>}
        </div>

        {/* Estatus */}
        <div className="mb-3">
          <label>Estatus:</label>
          <select
            value={estatus}
            onChange={(e) => setEstatus(e.target.value)}
            className={`form-control ${estatus === 'Activo' ? 'bg-success text-white' : 'bg-secondary text-white'}`}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Imagen del producto */}
        <div className="mb-3">
          <label>Imagen del Producto:</label>
          <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
          {preview && (
            <div className="mt-3 text-center">
              <img src={preview} alt="Vista previa" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '10px' }} />
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100">
          {id ? 'Actualizar' : 'Guardar'}
        </button>
      </form>
    </div>
  );
};
