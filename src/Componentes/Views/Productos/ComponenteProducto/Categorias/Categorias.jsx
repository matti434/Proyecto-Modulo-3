import { useNavigate } from 'react-router-dom';
import './Categorias.css';
import { Col, Row, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';

const imgCard = new URL('/Productos/imgCard.jpg', import.meta.url).href;
const ImgCascos = new URL('/Productos/ImgCascos.jpg', import.meta.url).href;
const ImgIndumentaria = new URL('/Productos/ImgIndumentaria.jpg', import.meta.url).href;
const ImgTaller = new URL('/Productos/ImgTaller.jpg', import.meta.url).href;

const Categorias = () => {
  const navigate = useNavigate();

  const animacionScroll = {
    initial: { opacity: 0, y: 70 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: "easeOut" },
    viewport: { once: true, amount: 0.3 }
  };

  const animacionHover = (direccion) => ({
    whileHover: {
      x: direccion === "izquierda" ? -12 : 12,
      scale: 1.015,
      transition: { type: "spring", stiffness: 160, damping: 14 }
    }
  });

  const manejarClickCategoria = (categoria) => {
    navigate('/productos', { state: { categoriaSeleccionada: categoria } });
  };

  return (
    <div className="contenedor-principal">
      <div className="contenedor-tarjeta">
        <p className="titulo-seccion">Nuestros servicios</p>

        {/* MOTOS */}
        <motion.div {...animacionScroll} {...animacionHover("izquierda")} onClick={() => manejarClickCategoria('motos')}>
          <Card className="tarjeta-categoria altura-tarjeta">
            <Row className="g-0 h-100">
              <Col md={6}>
                <div className="imagen-tarjeta" style={{ backgroundImage: `url(${imgCard})` }} />
              </Col>
              <Col md={6}>
                <Card.Body className="cuerpo-tarjeta">
                  <h3 className="titulo-categoria">Motocicletas</h3>
                  <p className="texto-descripcion">
                    Descubrí nuestra línea de motocicletas de alto rendimiento y diseño premium.
                  </p>
                  <span className="boton-categoria">Ver productos</span>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* PROTECCIONES */}
        <motion.div {...animacionScroll} {...animacionHover("derecha")} onClick={() => manejarClickCategoria('protecciones')}>
          <Card className="tarjeta-categoria altura-tarjeta">
            <Row className="g-0 h-100">
              <Col md={6} className="order-2 order-md-1">
                <Card.Body className="cuerpo-tarjeta">
                  <h3 className="titulo-categoria">Protecciones</h3>
                  <p className="texto-descripcion">
                    Equipamiento certificado para máxima seguridad en cada viaje.
                  </p>
                  <span className="boton-categoria">Ver productos</span>
                </Card.Body>
              </Col>
              <Col md={6} className="order-1 order-md-2">
                <div className="imagen-tarjeta" style={{ backgroundImage: `url(${ImgCascos})` }} />
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* INDUMENTARIA */}
        <motion.div {...animacionScroll} {...animacionHover("izquierda")} onClick={() => manejarClickCategoria('indumentaria')}>
          <Card className="tarjeta-categoria altura-tarjeta">
            <Row className="g-0 h-100">
              <Col md={6}>
                <div className="imagen-tarjeta" style={{ backgroundImage: `url(${ImgIndumentaria})` }} />
              </Col>
              <Col md={6}>
                <Card.Body className="cuerpo-tarjeta">
                  <h3 className="titulo-categoria">Indumentaria</h3>
                  <p className="texto-descripcion">
                    Guantes, camperas y accesorios con estilo y protección.
                  </p>
                  <span className="boton-categoria">Ver productos</span>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* TALLER */}
        <motion.div {...animacionScroll} {...animacionHover("derecha")} onClick={() => manejarClickCategoria('taller')}>
          <Card className="tarjeta-categoria altura-tarjeta">
            <Row className="g-0 h-100">
              <Col md={6} className="order-2 order-md-1">
                <Card.Body className="cuerpo-tarjeta">
                  <h3 className="titulo-categoria">Taller</h3>
                  <p className="texto-descripcion">
                    Servicios especializados con tecnología de última generación.
                  </p>
                  <span className="boton-categoria">Ver servicios</span>
                </Card.Body>
              </Col>
              <Col md={6} className="order-1 order-md-2">
                <div className="imagen-tarjeta" style={{ backgroundImage: `url(${ImgTaller})` }} />
              </Col>
            </Row>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};

export default Categorias;
