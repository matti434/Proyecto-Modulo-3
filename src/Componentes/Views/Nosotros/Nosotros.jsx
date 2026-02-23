import { FaGithub } from "react-icons/fa";
import "./Nosotros.css";
import { h1, img } from "framer-motion/client";

const integrantes = [
  {
    id: 1,
    nombre: "Matias Lazarte",
    rol: "Lider Tecnico",
    descripcion:
      "Construyo la infraestructura técnica sólida que soporta cada función, siempre pensando en cómo cada línea de código mejora la experiencia global.",
    github: "https://github.com/matti434",
  },
  {
    id: 2,
    nombre: "Romina Danelutto",
    rol: "Scrum Master",
    descripcion:
      "Coordino al equipo, organizo y facilito el cumplimiento de cada sprint. Colaboro en el desarrollo de nuevas funcionalidades para mejorar la experiencia del usuario",
    github: "https://github.com/rominadanelutto",
  },
  {
    id: 3,
    nombre: "Alvaro Morillo",
    rol: "Fullstack Developer",
    descripcion:
      "Conecto cada pieza del proyecto, asegurando que diseño, tecnología y estrategia trabajen en armonía hacia un objetivo común. Trabajo en equipo para integrar mejoras continuas",
    github: "https://github.com/alvaro-morillo",
  },
    {
    id: 4,
    nombre: "Miguel Zambrano",
    rol: "Fullstack Developer",
    descripcion:
      "Participo tanto en frontend como backend, integrando componentes visuales con la lógica del sistema. Apoyo en nuevas funcionalidades y optimización general del proyecto. Aporte constante a la evolución técnica y funcional del proyecto",
    github: "https://github.com/mizambran",
  },
    {
    id: 5,
    nombre: "Patricio Romero",
    imagen: "/Nosotros/foto_32x43mm_300dpi.jpg",
    rol: "Fullstack Developer",
    descripcion:
      "Colaboro en el desarrollo de nuevas funcionalidades, conectando diseño y código para mejorar la experiencia del usuario. Aporte constante a la evolución técnica y funcional",
    github: "https://github.com/pato1404",
  },
];

 const Nosotros = () => {
  return (
    <div className="nosotros-contenedor mt-5">
      <h1 className="titulo-nosotros">Nuestro Equipo</h1>

      <div className="grid-integrantes">
        {integrantes.map((persona) => (
          <div className="tarjeta-integrante" key={persona.id}>

            <h3>{persona.nombre}</h3>
            <img src={Nosotros} className="foto" />
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