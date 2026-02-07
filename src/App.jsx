import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./Componentes/Shared/SplashScreen/SplashScreen";
import Menu from "./Componentes/Shared/Menu/Menu";
import Home from "./Componentes/Views/Home/Home";
import Pagina404 from "./Componentes/Views/Pagina404/Pagina404";
import Ofertas from "./Componentes/Views/Productos/Ofertas/Ofertas";
import PaginaProductos from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/PaginaProductos";
import Contacto from "./Componentes/Views/Contacto/Contacto";
import Nosotros from "./Componentes/Views/Nosotros/Nosotros";
import AdminPanelContainer from "./Componentes/Admin/AdminPanelContainer";
import RutaProtegida from "./Componentes/Utils/RutaProtegida";
import Categorias from "./Componentes/Views/Productos/ComponenteProducto/Categorias/Categorias";
import DetalleProducto from "./Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto";
import CarritoContainer from "./Componentes/Views/Productos/componenteCarrito/CarritoContainer";
import Favoritos from "./Componentes/Views/Favoritos/Favoritos";
import Footer from "./Componentes/Shared/Footer/Footer";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { UserProvider } from "./Componentes/Context/ContextoUsuario";
import { ProveedorProductos } from "./Componentes/Context/ContextoProducto";
import { CarritoProvider } from "./Componentes/Context/ContextoCarrito";
import { FavoritosProvider } from "./Componentes/Context/ContextoFavoritos";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <FavoritosProvider>
      <CarritoProvider>
        <ProveedorProductos>
          <UserProvider>
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
          </UserProvider>
        </ProveedorProductos>
      </CarritoProvider>
    </FavoritosProvider>
  );
}

export default App;
