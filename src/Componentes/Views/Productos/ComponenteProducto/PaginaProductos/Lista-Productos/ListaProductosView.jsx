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

      <Row className="g-4">
        {productos.map((producto) => (
          <Col key={producto.id} xs={12} sm={6} lg={4} xl={3}>
            <CardProducto {...producto} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListaProductosView;
