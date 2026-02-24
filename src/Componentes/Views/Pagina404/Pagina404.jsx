import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Pagina404.css";

export default function Pagina404() {
  const parallaxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.clientX) / 35;
      const y = (window.innerHeight / 2 - e.clientY) / 35;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="error-container">
      <div className="parallax" ref={parallaxRef}>
        <h1 className="error-title">404</h1>
        <p className="error-subtitle">Página no encontrada</p>
      </div>

      <p className="error-text">
        Parece que tomaste un camino desconocido. Volvamos a la ruta correcta.
      </p>

      <button onClick={() => navigate("/")} className="error-btn">
        Volver al inicio
      </button>
    </div>
  );
}
