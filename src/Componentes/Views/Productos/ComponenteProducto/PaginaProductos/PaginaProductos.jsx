import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import { useProductos } from "../../../../Context/ContextoProducto";
import BuscadorProducto from "./componenteBuscarProducto/BuscadorProducto";
import ListaProductosContainer from "./Lista-Productos/ListaProductosContainer";

import "../../../../../estilos/variables.css";
import "./PaginaProductos.css";

const PaginaProductos = () => {
  const location = useLocation();
  const { filtrarPorCategoria, obtenerCategoriasUnicas } = useProductos();

  useEffect(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location, filtrarPorCategoria]);

  const categorias = obtenerCategoriasUnicas();

  return (
    <Container fluid className="pagina-productos mt-5 py-5">
      <div className="contenido-principal">
        <div className="seccion-buscador">
          <div className="encabezado-buscador">
            <h2 className="titulo-seccion">
              Encuentra Tu Classic
            </h2>
            <p className="descripcion-seccion">
              Filtra y encuentra la motocicleta que se adapte a tu estilo de vida
            </p>
            
            {location.state?.categoriaSeleccionada && (
              <div className="categoria-actual-badge">
                <span className="badge bg-primary">
                  Categoría: {location.state.categoriaSeleccionada}
                </span>
                <span className="ms-2 text-muted">
                  ({categorias.length} categorías disponibles)
                </span>
              </div>
            )}
          </div>
          <BuscadorProducto />
        </div>

        <div className="seccion-lista-productos">
          <div className="encabezado-lista">
            <h2 className="titulo-seccion">
              <span className="icono-titulo">⭐</span>
              Nuestro Catálogo
            </h2>
            <p className="descripcion-seccion">
              Colección de motocicletas Royal Enfield disponibles
            </p>
          </div>
          <ListaProductosContainer />
        </div>
      </div>

      <div className="informacion-adicional">
        <div className="tarjeta-informativa">
          <div className="icono-tarjeta">👨‍🔧</div>
          <h3>Asesoría Especializada</h3>
          <p className="texto-tarjeta">
            Nuestros expertos en motocicletas clásicas están listos para ayudarte 
            a encontrar la Royal Enfield perfecta para ti.
          </p>
          <button className="boton-contacto">
            <span className="texto-boton">Contactar Concesionario</span>
            <span className="icono-boton">→</span>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default PaginaProductos;