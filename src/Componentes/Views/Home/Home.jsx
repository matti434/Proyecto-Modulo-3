import { useState, useEffect } from "react";
import Categorias from "../Productos/ComponenteProducto/Categorias/Categorias";
import Galeria from "./galeria/Galeria";
import Portada from "./inicio/Portada";
import { homeApi } from "../../../Services/Api/homeApi";
import "./Home.css";
import { div } from "framer-motion/client";

const Home = () => {
  const [contenido, setContenido] = useState({
    galeria: [],
    portada: { imagenUrl: "" },
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancel = false;
    const cargar = async () => {
      try {
        setError(null);
        const data = await homeApi.obtenerContenidoHome();
        if (!cancel) {
          setContenido({
            galeria: Array.isArray(data.galeria) ? data.galeria : [],

            portada:
              data.portada && data.portada.imagenUrl
                ? { imagenUrl: data.portada.imagenUrl }
                : { imagenUrl: "" },

          });
        }
      } catch (e) {
        if (!cancel) {
          setError(e?.message || "Error al cargar la home");
        }
      } finally {
        if (!cancel) setCargando(false);
      }
    };
    cargar();
    return () => {
      cancel = true;
    };

  }, []);

  if (cargando) {
    return (
      <div className="py-5 text-center">
        <p>Cargando inicio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5 text-center">
        <p role="alert">{error}</p>
      </div>
    );
  }

  return (
    <div className="home-contenedor">
      <aside className="home-publicidad home-publicidad-izq" aria-hidden="true">
        <div className="home-publicidad-placeHolder">
          <img src="/publicidad/images.jpg" alt="Publicidad" />
        </div>
      </aside>
      <main className="home-contenido-principal">
        <Galeria imagenes={contenido.galeria} />
        <Categorias />
        <Portada imagenUrl={contenido.portada.imagenUrl} />
      </main>
      <aside className="home-publicidad home-publicidad-der" aria-hidden= "true">
        <div className="home-publicidad-placeholder">
          <img src="/publicidad/images (2).jpg" alt="Publicidad" />
        </div>
      </aside>
    </div>
  );
};

export default Home;
