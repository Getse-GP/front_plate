import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
/*
import './App.css'
*/

//Componentes compartidos
import { HeaderComponent } from './assets/components/HeaderComponent'
import { FooterComponent } from './assets/components/FooterComponent'

//Componentes de Cliente
import { ListClienteComponent } from './assets/components/ListClienteComponent'
import { ClienteComponent } from './assets/components/ClienteComponent'

//Componentes de Atender
import { ListAtenderComponent } from './assets/components/ListAtenderComponent'
import { AtenderComponent } from './assets/components/AtenderComponent'

//Componentes de Detalle
import { ListDetalleComponent } from './assets/components/ListDetalleComponent'

//Componentes de Empleado
import { ListEmpleadoComponent } from './assets/components/ListEmpleadoComponent'
import { EmpleadoComponent } from './assets/components/EmpleadoComponent'

//Componentes de Mesa
import { ListMesaComponent } from './assets/components/ListMesaComponent'
import { MesaComponent } from './assets/components/MesaComponent'

//Componentes de Pedido
import { ListPedidoComponent } from './assets/components/ListPedidoComponent'
import { PedidoComponent } from './assets/components/PedidoComponent'

//Componentes de Producto
import { ListProductoComponent } from './assets/components/ListProductoComponent'
import { ProductoComponent } from './assets/components/ProductoComponent'

//Componentes de Reservar
import { ListReservarComponent } from './assets/components/ListReservarComponent'
import { ReservarComponent } from './assets/components/ReservarComponent'

//Componentes de Tipo
import { ListTipoComponent } from './assets/components/ListTipoComponent'
import { TipoComponent } from './assets/components/TipoComponent'

import  InicioComponent  from './assets/components/InicioComponent'

import LoginComponent from './assets/components/LoginComponent';
import RegistroComponent from './assets/components/RegistroComponent';
import ProductoClienteComponent from './assets/components/ProductoClienteComponent';
import InicioSesionComponent from "./assets/components/InicioSesionComponent";

import { MisReservacionesComponent } from "./assets/components/MisReservacionesComponent";

import { ReservarClienteComponent } from "./assets/components/ReservarClienteComponent";
import { PedidoMeseroComponent } from "./assets/components/PedidoMeseroComponent";

import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <HeaderComponent />

        <Routes>
          {/* --- RUTA DE INICIO --- */}
          <Route path='/' element={<InicioComponent />} />
          <Route path="/inicio-sesion-requerida" element={<InicioSesionComponent />} /> 

          <Route path='/login' element={<LoginComponent />} />
           <Route path='/registro' element={<RegistroComponent />} />
          
          {/* --- RUTAS DETALLE --- */}
          <Route path='/detalle/lista' element={<ListDetalleComponent />} />

          {/* --- RUTAS CLIENTE --- */}
          <Route path='/cliente' element={<ListClienteComponent />} />
          <Route path='/cliente/lista' element={<ListClienteComponent />} />
          <Route path='/cliente/nuevo' element={<ClienteComponent />} />
          <Route path='/cliente/edita/:id' element={<ClienteComponent />} />

          {/* --- RUTAS ATENDER --- */}
          <Route path='/atender' element={<ListAtenderComponent />} />
          <Route path='/atender/lista' element={<ListAtenderComponent />} />
          <Route path='/atender/nuevo' element={<AtenderComponent />} />
          <Route path='/atender/edita/:id' element={<AtenderComponent />} />

          {/* --- RUTAS EMPLEADO --- */}
          <Route path='/empleado' element={<ListEmpleadoComponent />} />
          <Route path='/empleado/lista' element={<ListEmpleadoComponent />} />
          <Route path='/empleado/nuevo' element={<EmpleadoComponent />} />
          <Route path='/empleado/edita/:id' element={<EmpleadoComponent />} />

          {/* --- RUTAS MESA --- */}
          <Route path='/mesa' element={<ListMesaComponent />} />
          <Route path='/mesa/lista' element={<ListMesaComponent />} />
          <Route path='/mesa/nuevo' element={<MesaComponent />} />
          <Route path='/mesa/edita/:id' element={<MesaComponent />} />

          {/* --- RUTAS PEDIDO --- */}
          <Route path='/pedido' element={<ListPedidoComponent />} />
          <Route path='/pedido/lista' element={<ListPedidoComponent />} />
          <Route path='/pedido/nuevo' element={<PedidoComponent />} />
          <Route path='/pedido/edita/:id' element={<PedidoComponent />} />
          <Route path='/pedido/edita-atender/:idAtender' element={<PedidoComponent />} />
          <Route path='/mis-pedidos' element={<PedidoMeseroComponent />} />

          {/* --- RUTAS PRODUCTO --- */}
          <Route path='/producto' element={<ListProductoComponent />} />
          <Route path='/producto/lista' element={<ListProductoComponent />} />
          <Route path='/producto/nuevo' element={<ProductoComponent />} />
          <Route path='/producto/edita/:id' element={<ProductoComponent />} />
            <Route path='/producto/productoCliente/' element={<ProductoClienteComponent />} />

          {/* --- RUTAS RESERVAR --- */}
          <Route path='/reservar' element={<ListReservarComponent />} />
          <Route path='/reservar/lista' element={<ListReservarComponent />} />
          <Route path='/reservar/nuevo' element={<ReservarComponent />} />
          <Route path='/reservar/editar/:id' element={<ReservarComponent />} />
          <Route path='/misreservas' element={<MisReservacionesComponent />} />

          <Route path="/reservar/nuevo-cliente" element={<ReservarClienteComponent />} /> 
          <Route path="/reservar/editar-cliente/:id" element={<ReservarClienteComponent />} />

          {/* --- RUTAS TIPO --- */}
          <Route path='/tipo' element={<ListTipoComponent />} />
          <Route path='/tipo/lista' element={<ListTipoComponent />} />
          <Route path='/tipo/nuevo' element={<TipoComponent />} />
          <Route path='/tipo/edita/:id' element={<TipoComponent />} />
        </Routes>

        <FooterComponent />
      </BrowserRouter>
    </>
  )
}

export default App
