import React from 'react'

// Definición de colores de la identidad visual Plate & Co.
const primaryColor = "#1A237E"; // Azul Marino Intenso
const textColor = "#FFFFFF";    // Blanco
const accentColor = "#FF5722";   // Naranja Oscuro/Terracota (opcional para enlaces)

export const FooterComponent = () => {
  return (
  <footer style={{
   width: "100%",
   //Fondo Azul Marino Intenso
   background: primaryColor, 
   padding: "20px 20px",
   //Borde superior con un tono sutil
   borderTop: "1px solid #3c488e", 
   textAlign: "center",
   marginTop: "auto" // Ayuda a asegurar que el footer se quede abajo
  }}>
   <nav>
    <a 
            href="#" 
            style={{ 
                fontWeight: "bold", 
                fontSize: "16px", 
                textDecoration: "none", 
                //Color Blanco para el texto
                color: textColor 
            }}
        >
     Karla Getsemani Pelaez Zacapala
    </a>
   </nav>
   <p style={{ 
            marginTop: "10px", 
            fontSize: "14px", 
            //Color Blanco o un gris muy claro
            color: "#cccccc" 
        }}>
    © 2025 Plate & Co. | Todos los derechos reservados.
 </p>
  </footer>
 )
}

export default FooterComponent;