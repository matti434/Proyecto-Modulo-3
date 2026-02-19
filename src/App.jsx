import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CarritoProvider } from "./Componentes/Context/ContextoCarrito";
import { FavoritosProvider } from "./Componentes/Context/ContextoFavoritos";
import { ProveedorProductos } from "./Componentes/Context/ContextoProducto";
import { UserProvider } from "./Componentes/Context/ContextoUsuario";

import AdminPanelContainer from "./Componentes/Admin/AdminPanelContainer";
import Footer from "./Componentes/Shared/Footer/Footer";
import Menu from "./Componentes/Shared/Menu/Menu";
import SplashScreen from "./Componentes/Shared/SplashScreen/SplashScreen";
import RutaProtegida from "./Componentes/Utils/RutaProtegida";
import Contacto from "./Componentes/Views/Contacto/Contacto";
import Favoritos from "./Componentes/Views/Favoritos/Favoritos";
import Home from "./Componentes/Views/Home/Home";
import Nosotros from "./Componentes/Views/Nosotros/Nosotros";
import Pagina404 from "./Componentes/Views/Pagina404/Pagina404";
import CarritoContainer from "./Componentes/Views/Productos/componenteCarrito/CarritoContainer";
import Categorias from "./Componentes/Views/Productos/ComponenteProducto/Categorias/Categorias";
import DetalleProducto from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto";
import CarritoContainer from "./Componentes/Views/Productos/componenteCarrito/CarritoContainer";
import Footer from "./Componentes/Shared/Footer/Footer";
import RecuperarPassword from "./Componentes/Views/Login/RecuperarPassword";
import PaginaProductos from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/PaginaProductos";
import Ofertas from "./Componentes/Views/Productos/Ofertas/Ofertas";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <FavoritosProvider>
      <ProveedorProductos>
        <UserProvider>
          <CarritoProvider>
            <BrowserRouter>
              <Menu />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/nosotros" element={<Nosotros />} />
                <Route path="/ofertas" element={<Ofertas />} />
                <Route path="/productos" element={<PaginaProductos />} />
                <Route path="/productos-todos" element={<div className="mt-5 py-5"><Categorias /></div>} />
                <Route path="/detalle-producto" element={<DetalleProducto />} />
                <Route path="/carrito" element={<CarritoContainer />} />
                  <Route path="/recuperar-password" element={ <RecuperarPassword />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="*" element={<Pagina404 />} />
                <Route
                  path="/admin"
                  element={
                    <RutaProtegida>
                      <AdminPanelContainer />
                    </RutaProtegida>
                  }
                />
              </Routes>
              <Footer />
            </BrowserRouter>
          </CarritoProvider>
        </UserProvider>
      </ProveedorProductos>
    </FavoritosProvider>
  );
}

export default App;
