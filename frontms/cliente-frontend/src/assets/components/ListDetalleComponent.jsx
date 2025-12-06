import React, { useEffect, useState } from 'react';
import { listDetalles } from '../../services/DetalleService';

export const ListDetalleComponent = () => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    listDetalles()
      .then((response) => {
        setDetalles(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener detalles:", error);
      });
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Lista de Detalles de Pedido</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID Detalle</th>
            <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID Cliente</th>
            <th style={{ border: "1px solid #ddd", padding: "12px" }}>ID Pedido</th>
            <th style={{ border: "1px solid #ddd", padding: "12px" }}>Fecha y Hora</th>
          </tr>
        </thead>
        <tbody>
          {detalles.length > 0 ? (
            detalles.map((detalle, index) => (
              <tr key={detalle.idDetalle} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{detalle.idDetalle}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{detalle.idCliente}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>{detalle.idPedido}</td>
                <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                  {new Date(detalle.fechaHora).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "10px" }}>
                No hay detalles registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
