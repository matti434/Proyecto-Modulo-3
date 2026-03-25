import { useEffect, useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, Button, Spinner } from "react-bootstrap";
import { pagosApi } from "../../../Services/Api";
import { useCarrito } from "../../Context/ContextoCarrito";
import { useProductos } from "../../Context/ContextoProducto";
import "./PagoResultado.css";

const PagoExitoso = () => {
  const { search } = useLocation();
  const { vaciarCarrito } = useCarrito();
  const { cargarProductos } = useProductos();
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const { paymentIdMp, transaccionId, externalReference } = useMemo(() => {
    const q = new URLSearchParams(search);
    const payment = q.get("payment_id") || q.get("collection_id") || "";
    const ext = q.get("external_reference")?.trim() || "";
    const pref = q.get("preference_id")?.trim() || "";
    const trans = ext || pref || payment || "";
    return {
      paymentIdMp: payment,
      transaccionId: trans,
      externalReference: ext,
    };
  }, [search]);

  useEffect(() => {
    const verificar = async () => {
      if (!transaccionId) {
        setCargando(false);
        await vaciarCarrito();
        await cargarProductos({});
        return;
      }
      try {
        const resultado = await pagosApi.verificarPago(transaccionId, {
          paymentId: paymentIdMp || undefined,
        });

        if (resultado?.exito) {
          if (paymentIdMp) {
            await pagosApi.confirmarPago({
              payment_id: paymentIdMp,
              external_reference: externalReference || transaccionId,
            });
          }
          await vaciarCarrito();
          await cargarProductos({});
        } else {
          setError(resultado?.mensaje || "No se pudo verificar el pago");
        }
      } catch (err) {
        setError(err?.message || "Error al verificar el pago");
      } finally {
        setCargando(false);
      }
    };
    verificar();
  }, [
    transaccionId,
    paymentIdMp,
    externalReference,
    vaciarCarrito,
    cargarProductos,
  ]);

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Verificando tu pago...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Card className="pago-resultado-card">
          <Card.Body>
            <div className="text-center text-warning pago-resultado-icono">⚠️</div>
            <h4 className="text-center mb-3">Problema al verificar</h4>
            <p className="text-center text-muted">{error}</p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              <Button as={Link} to="/carrito" variant="outline-primary">
                Volver al carrito
              </Button>
              <Button as={Link} to="/" variant="primary">
                Volver al inicio
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <Card className="pago-resultado-card">
        <Card.Body>
          <div className="text-center text-success pago-resultado-icono">✓</div>
          <h4 className="text-center mb-3">¡Pago realizado con éxito!</h4>
          <p className="text-center text-muted mb-3">
            Tu pago ha sido procesado correctamente.
          </p>
          {transaccionId && (
            <p className="text-center small mb-3">
              Referencia: <code className="pago-resultado-code">{transaccionId}</code>
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

export default PagoExitoso;
