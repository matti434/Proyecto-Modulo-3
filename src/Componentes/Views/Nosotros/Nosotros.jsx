import { FaGithub } from "react-icons/fa";
import "./Nosotros.css";

const INTEGRANTES = [
  {
    id: 1,
    nombre: "Integrante 1",
    descripcion: "Descripción del primer miembro del equipo.",
    foto: "/equipo/1.jpg",
    github: "https://github.com",
  },
  {
    id: 2,
    nombre: "Integrante 2",
    descripcion: "Descripción del segundo miembro del equipo.",
    foto: "/equipo/2.jpg",
    github: "https://github.com",
  },
  {
    id: 3,
    nombre: "Integrante 3",
    descripcion: "Descripción del tercer miembro del equipo.",
    foto: "/equipo/3.jpg",
    github: "https://github.com",
  },
  {
    id: 4,
    nombre: "Integrante 4",
    descripcion: "Descripción del cuarto miembro del equipo.",
    foto: "/equipo/4.jpg",
    github: "https://github.com",
  },
];

const Nosotros = () => {
  return (
    <div className="nosotros-contenedor mt-5">
      <h1 className="titulo-nosotros">Nuestro Equipo</h1>
      <div className="grid-integrantes">
        {INTEGRANTES.map((persona) => (
          <article className="tarjeta-integrante" key={persona.id}>
            <div className="tarjeta-integrante-imagen-wrapper">
              <img
                src={persona.foto}
                alt={persona.nombre}
                className="tarjeta-integrante-imagen"
                onError={(e) => {
                  e.target.src = "https://placehold.co/280x280/2a2a2a/c9a227?text=Foto";
                }}
              />
            </div>
            <h3 className="nombre-integrante">{persona.nombre}</h3>
            <p className="descripcion-integrante">{persona.descripcion}</p>
            <a
              href={persona.github}
              target="_blank"
              className="link-github"
              rel="noopener noreferrer"
              aria-label={`GitHub de ${persona.nombre}`}
            >
              <FaGithub size={22} /> GitHub
            </a>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Nosotros;
