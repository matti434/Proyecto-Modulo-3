import { useSearchParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PagoResultado.css";

const PagoPendiente = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const externalRef = searchParams.get("external_reference");

  return (
    <div className="container py-5">
      <Card className="pago-resultado-card">
        <Card.Body>
          <div className="text-center text-warning pago-resultado-icono">⏳</div>
          <h4 className="text-center mb-3">Pago pendiente</h4>
          <p className="text-center text-muted mb-3">
            Tu pago está siendo procesado. Te notificaremos cuando se complete.
          </p>
          {(paymentId || externalRef) && (
            <p className="text-center small mb-3">
              Referencia: <code className="pago-resultado-code">{paymentId || externalRef}</code>
            </p>
          )}
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Button as={Link} to="/productos" variant="primary">
              Seguir comprando
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

export default PagoPendiente;
