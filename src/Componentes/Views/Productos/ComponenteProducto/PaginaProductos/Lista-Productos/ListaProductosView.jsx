import { Row, Col, Spinner, Alert, Badge, Pagination } from "react-bootstrap";
import CardProducto from "../card-Producto/CardProducto";
import "./ListaProducto.css";

const ListaProductosView = ({
  productos,
  cargando,
  filtros,
  tieneResultados,
  cantidadResultados,
  paginaActual,
  totalPaginas,
  productosPorPagina,
  irAPagina,
}) => {
  if (cargando) {
    return (
      <div className="contenedor-cargando">
        <Spinner animation="border" variant="primary" />
        <p className="texto-cargando">Cargando productos...</p>
      </div>
    );
  }

  if (!tieneResultados) {
    return (
      <Alert variant="info" className="alerta-sin-productos">
        <Alert.Heading>
          {filtros.categoria
            ? `No hay productos en la categoría "${filtros.categoria}"`
            : "No se encontraron productos"}
        </Alert.Heading>
        <p>
          {filtros.terminoBusqueda
            ? `No hay resultados para "${filtros.terminoBusqueda}"`
            : `No hay productos disponibles con los filtros seleccionados`}
        </p>
      </Alert>
    );
  }

  return (
    <div className="contenedor-lista-productos mt-5">
      {filtros.categoria && (
        <div className="informacion-categoria mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-2">
                <Badge bg="primary" className="me-2">
                  {cantidadResultados} producto
                  {cantidadResultados !== 1 ? "s" : ""}
                </Badge>
                {productos.length} producto{productos.length !== 1 ? "s" : ""}
              </h4>
            </div>
            <small className="text-muted">
              Mostrando productos de la categoría seleccionada
            </small>
          </div>
        </div>
      )}
      div className="contenedor-grid-productos"
      {productos.map((producto) => (
        <div key={producto.id ?? producto._id} className="item-producto">
          <CardProducto {...producto} />
        </div>
      ))}
    </div>
  );
};
{
  totalPaginas > 1 && (
    <div className="paginacion-productos mt-4">
      <span className="info-pagina">
        Mostrando {(paginaActual - 1) * productosPorPagina + 1}–
        {Math.min(paginaActual * productosPorPagina, cantidadResultados)} de
        {cantidadResultados}
      </span>
      <Pagination className="mb-0">
        <Pagination.Prev
          disabled={paginaActual === 1}
          onClick={() => irAPagina(paginaActual - 1)}
          aria-label="Anterior"
        />

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <Pagination.Item
            key={num}
            active={num === paginaActual}
            onClick={() => irAPagina(num)}
          >
            {num}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={paginaActual === totalPaginas}
          onClick={() => irAPagina(paginaActual + 1)}
          aria-label="Siguiente"
        />
      </Pagination>
    </div>
  );
}

export default ListaProductosView;
