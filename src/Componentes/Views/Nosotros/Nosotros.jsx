import { FaGithub } from "react-icons/fa";
import "./Nosotros.css";

const integrantes = [
  {
    id: 1,
    nombre: "Tomas Gomez",
    rol: "FullStack Developer",
    descripcion:
      "Doy vida visual al proyecto, pero mi visión abarca todo el flujo del usuario. Cada elemento que diseño responde a una necesidad del negocio.",
    foto: "/imagenes/integrante1.jpg",
    github: "https://github.com/tomasgomez18",
  },
  {
    id: 2,
    nombre: "Matias Lazarte",
    rol: "FullStack Developer",
    descripcion:
      "Construyo la infraestructura técnica sólida que soporta cada función, siempre pensando en cómo cada línea de código mejora la experiencia global.",
    foto: "/imagenes/integrante2.jpg",
    github: "https://github.com/matti434",
  },
  {
    id: 3,
    nombre: "Juan Pablo Vergara",
    rol: "Fullstack Developer",
    descripcion:
      "Conecto cada pieza del proyecto, asegurando que diseño, tecnología y estrategia trabajen en armonía hacia un objetivo común.",
    foto: "/imagenes/integrante3.jpg",
    github: "https://github.com/juampa926",
  },

];

 const Nosotros = () => {
  return (
    <div className="nosotros-contenedor mt-5">
      <h1 className="titulo-nosotros">Nuestro Equipo</h1>

      <div className="grid-integrantes">
        {integrantes.map((persona) => (
          <div className="tarjeta-integrante" key={persona.id}>
            <img
              src={persona.foto}
              alt={persona.nombre}
              className="foto-integrante"
            />

            <h3>{persona.nombre}</h3>
            <p className="rol-integrante">{persona.rol}</p>
            <p className="descripcion-integrante">{persona.descripcion}</p>

            <a
              href={persona.github}
              target="_blank"
              className="link-github"
              rel="noopener noreferrer"
            >
              <FaGithub size={25} /> GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nosotros