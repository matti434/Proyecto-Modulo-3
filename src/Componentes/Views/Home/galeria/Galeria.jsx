import { useState } from "react";
import "./Galeria.css";

const Galeria = ({ imagenes = [] }) => {
  const [index, setIndex] = useState(0);

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % Math.max(1, imagenes.length));
  };

  const anterior = () => {
    setIndex((prev) =>
      (prev - 1 + imagenes.length) % Math.max(1, imagenes.length)
    );
  };

  const indexPrev =
    (index - 1 + imagenes.length) % Math.max(1, imagenes.length);
  const indexNext = (index + 1) % Math.max(1, imagenes.length);

  if (!imagenes.length) {
    return (
      <div className="galeria-container">
        <div className="galeria-wrapper">
          <p className="galeria-texto">No hay imágenes en la galería.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galeria-container">
      <div className="galeria-wrapper">
        <div className="galeria-lateral izquierda">
          <img src={imagenes[indexPrev].url} alt="previa" />
        </div>
        <div className="galeria-central">
          <button className="galeria-btn left" onClick={anterior}>
            ❮
          </button>
          <img src={imagenes[index].url} alt="principal" />
          <button className="galeria-btn right" onClick={siguiente}>
            ❯
          </button>
          <p className="galeria-texto">{imagenes[index].texto ?? ""}</p>
        </div>
        <div className="galeria-lateral derecha">
          <img src={imagenes[indexNext].url} alt="siguiente" />
        </div>
      </div>
    </div>
  );
};

export default Galeria;
