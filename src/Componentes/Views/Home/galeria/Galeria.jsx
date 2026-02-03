import { useState } from "react";
import "./Galeria.css";

const imagenes = [
  {
    url: "Galeria/RollingMotors.png",
    texto: "DISEÑADO PARA TODOS LOS CAMINOS — DISEÑADO PARA TODOS LOS VIAJES.",
  },
  {
    url: "Galeria/RE-HNTR-350-2-1024x682.jpeg",
    texto: "CADA CAMINO TIENE UNA HISTORIA. VÍVELA CON ROYAL ENFIELD.",
  },
  {
    url: "Galeria/Royal_Enfield_1177.jpg",
    texto:
      "SI EL COMPO TE PARECE ABURRIDO, DETENTE. BAJATE DE LA MOTOCICLETA...",
  },
];

const Galeria = () => {
  const [index, setIndex] = useState(0);

  const siguiente = () => {
    setIndex((prev) => (prev + 1) % imagenes.length);
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const indexPrev = (index - 1 + imagenes.length) % imagenes.length;
  const indexNext = (index + 1) % imagenes.length;

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

          <p className="galeria-texto">{imagenes[index].texto}</p>
        </div>

        <div className="galeria-lateral derecha">
          <img src={imagenes[indexNext].url} alt="siguiente" />
        </div>
      </div>
    </div>
  );
};

export default Galeria;
