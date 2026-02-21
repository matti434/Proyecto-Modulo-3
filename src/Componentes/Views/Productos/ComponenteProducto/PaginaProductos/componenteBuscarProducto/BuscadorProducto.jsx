import { Container, Row, Col, Form, Card, Button, InputGroup } from "react-bootstrap";
import { Toaster } from "react-hot-toast";
import { useBuscadorProducto } from "./useBuscadorProducto";
import "./BuscadorProductos.css";

const BuscadorProducto = () => {
  const {
    filtrosLocales,
    errores,
    categoriasUnicas,
    marcasUnicas,
    modelosUnicos,
    configuracionValidaciones,
    prevenirCaracteresInvalidos,
    manejarCambioFiltro,
    manejarAplicarFiltros,
    manejarLimpiarFiltros,
    manejarBusquedaEnTiempoReal,
    manejarCambioCategoria,
  } = useBuscadorProducto();

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        containerClassName="toast-container-royal"
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          className: "royal-toast",
          duration: 4000,
          success: {
            iconTheme: { primary: "var(--color-oscuro)", secondary: "var(--color-dorado)" },
          },
          error: {
            iconTheme: { primary: "var(--color-crema)", secondary: "var(--color-rojo)" },
          },
        }}
      />
      <Container className="my-4 buscador-royal-enfield">
        <Row>
          <Col lg={12}>
            <h2 className="text-center mb-3 titulo-buscador mt-2">Buscador de Productos</h2>
            <Card className="shadow-sm mb-3 card-buscador">
              <Card.Body className="cuerpo-buscador">
                <Form onSubmit={manejarAplicarFiltros} noValidate>
                  <Row>
                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">
                          Buscar producto
                          <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                            (Solo letras o números)
                          </span>
                        </Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            placeholder="Nombre, marca o modelo..."
                            className={`input-royal ${errores.terminoBusqueda ? "is-invalid" : ""}`}
                            value={filtrosLocales.terminoBusqueda}
                            onChange={(e) => manejarBusquedaEnTiempoReal(e.target.value)}
                            onKeyDown={(e) => prevenirCaracteresInvalidos(e, "alfanumerico")}
                            pattern={configuracionValidaciones.terminoBusqueda.pattern}
                            title={configuracionValidaciones.terminoBusqueda.title}
                            maxLength={configuracionValidaciones.terminoBusqueda.maxLength}
                            minLength={3}
                          />
                        </InputGroup>
                        {errores.terminoBusqueda && (
                          <div className="invalid-feedback d-block" style={{ color: "var(--color-rojo)" }}>
                            {errores.terminoBusqueda}
                          </div>
                        )}
                        <Form.Text className="text-muted">
                          Mínimo 3 caracteres, máximo 50 caracteres. No se permiten símbolos.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Categoría</Form.Label>
                        <Form.Select
                          className="select-royal"
                          value={filtrosLocales.categoria}
                          onChange={(e) => manejarCambioCategoria(e.target.value)}
                        >
                          <option value="">Todas las categorías</option>
                          {categoriasUnicas.map((categoria) => (
                            <option key={categoria} value={categoria}>
                              {categoria}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Label className="etiqueta-form">
                        Rango de precio
                        <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                          (Solo números enteros positivos)
                        </span>
                      </Form.Label>
                      <Row>
                        <Col>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              inputMode="numeric"
                              className={`input-royal ${errores.precioMin ? "is-invalid" : ""}`}
                              placeholder="Mínimo"
                              value={filtrosLocales.precioMin}
                              onChange={(e) => manejarCambioFiltro("precioMin", e.target.value)}
                              onKeyDown={(e) => prevenirCaracteresInvalidos(e, "numerico")}
                              pattern={configuracionValidaciones.precioMin.pattern}
                              title={configuracionValidaciones.precioMin.title}
                              maxLength={configuracionValidaciones.precioMin.maxLength}
                            />
                            {errores.precioMin && (
                              <div className="invalid-feedback d-block" style={{ color: "var(--color-rojo)" }}>
                                {errores.precioMin}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group>
                            <Form.Control
                              type="text"
                              inputMode="numeric"
                              className={`input-royal ${errores.precioMax ? "is-invalid" : ""}`}
                              placeholder="Máximo"
                              value={filtrosLocales.precioMax}
                              onChange={(e) => manejarCambioFiltro("precioMax", e.target.value)}
                              onKeyDown={(e) => prevenirCaracteresInvalidos(e, "numerico")}
                              pattern={configuracionValidaciones.precioMax.pattern}
                              title={configuracionValidaciones.precioMax.title}
                              maxLength={configuracionValidaciones.precioMax.maxLength}
                            />
                            {errores.precioMax && (
                              <div className="invalid-feedback d-block" style={{ color: "var(--color-rojo)" }}>
                                {errores.precioMax}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Text className="text-muted">(solo números enteros, sin decimales)</Form.Text>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Marca</Form.Label>
                        <Form.Select
                          className="select-royal"
                          value={filtrosLocales.marca}
                          onChange={(e) => manejarCambioFiltro("marca", e.target.value)}
                        >
                          <option value="">Todas las marcas</option>
                          {marcasUnicas.map((marca) => (
                            <option key={marca} value={marca}>
                              {marca}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-2">
                      <Form.Group>
                        <Form.Label className="etiqueta-form">Modelo</Form.Label>
                        <Form.Select
                          className="select-royal"
                          value={filtrosLocales.modelo}
                          onChange={(e) => manejarCambioFiltro("modelo", e.target.value)}
                        >
                          <option value="">Todos los modelos</option>
                          {modelosUnicos.map((modelo) => (
                            <option key={modelo} value={modelo}>
                              {modelo}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-end mt-2">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        className="me-2 boton-limpiar"
                        onClick={manejarLimpiarFiltros}
                        style={{ borderColor: "var(--color-dorado)", color: "var(--color-oscuro)" }}
                      >
                        Limpiar filtros
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="boton-aplicar"
                        style={{
                          background: "var(--color-dorado)",
                          borderColor: "var(--color-dorado)",
                          color: "var(--color-oscuro)",
                        }}
                      >
                        Aplicar filtros
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BuscadorProducto;
