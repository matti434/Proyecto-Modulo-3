import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PagoResultado.css";

const PagoFallido = () => {
  return (
    <div className="container py-5">
      <Card className="pago-resultado-card">
        <Card.Body>
          <div className="text-center text-danger pago-resultado-icono">✕</div>
          <h4 className="text-center mb-3">Pago no realizado</h4>
          <p className="text-center text-muted mb-4">
            El pago no pudo completarse. Puedes intentar nuevamente desde el carrito.
          </p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button as={Link} to="/carrito" variant="primary">
              Volver al carrito
            </Button>
            <Button as={Link} to="/" variant="outline-secondary">
              Volver al inicio
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PagoFallido;
