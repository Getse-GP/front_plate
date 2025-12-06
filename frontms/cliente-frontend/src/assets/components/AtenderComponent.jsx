import React from 'react';

export const AtenderComponent = ({ empleados, idEmpleado, setIdEmpleado, error }) => {
  return (
    <div className="mb-3">
      <label>Mesero:</label>
     <select
  value={idEmpleado}
  onChange={(e) => setIdEmpleado(e.target.value)}
  className={`form-control ${error ? 'is-invalid' : ''}`}
>
  <option value="">-- Seleccione un mesero --</option>

  {empleados.map(emp => (
    <option key={emp.idEmpleado} value={emp.idEmpleado}>
      {emp.nombre}
    </option>
  ))}
</select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};
