import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import "./Ofertas.css";

function OfertaItem({ producto }) {
  const calcularTiempo = () => {
    const diferencia = producto.finOferta - new Date().getTime();

    if (diferencia <= 0) return "Finalizada";

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    return `${horas}h ${minutos}m ${segundos}s`;
  };

  const [tiempoRestante, setTiempoRestante] = useState(calcularTiempo());

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante(calcularTiempo());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const descuento = Math.round(
    ((producto.precioOriginal - producto.precioOferta) /
      producto.precioOriginal) *
      100
  );

  return (
    <Card className="oferta-card h-100">
      <Badge bg="danger" className="badge-oferta">
        -{descuento}%
      </Badge>

      <Card.Img src={producto.imagen} alt={producto.modelo} />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="oferta-titulo">
          {producto.marca} {producto.modelo}
        </Card.Title>

        <div className="precio-original">
          ${producto.precioOriginal.toLocaleString()}
        </div>

        <div className="precio-oferta">
          ${producto.precioOferta.toLocaleString()}
        </div>

        <div className="temporizador mt-auto">
          ⏰ {tiempoRestante}
        </div>

        <Button className="btn-oferta mt-3">
          Ver oferta
        </Button>
      </Card.Body>
    </Card>
  );
}

export default OfertaItem;
