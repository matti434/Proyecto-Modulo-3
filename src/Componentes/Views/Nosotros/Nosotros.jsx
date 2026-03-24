import { FaGithub } from "react-icons/fa";
import "./Nosotros.css";

const INTEGRANTES = [
  {
    id: 1,
    nombre: "Matias Lazarte",
    descripcion: "Tengo 25 años, Estudiante de ingenieria, actualmente sobreviviendo de desarrollador trainee de mobile, me gusta la ciberseguridad y el terere.",
    foto: "Equipo/foto_carnet_32x43mm_300dpi.jpg",
    github: "https://github.com/matti434",
  },
  {
    id: 2,
    nombre: "Alvaro Morillo",
    descripcion: "Desarrollador de 23 años apasionado por la tecnología y el aprendizaje constante. Me especializo en dar vida a interfaces funcionales y disfruto de dos cosas fundamentales para mi proceso creativo: programar y un buen mate siempre al lado. AGUANTE ROLLING.",
    foto: "Equipo/foto_carnet_32x43mm_final_300dpi.jpg",
    github: "https://github.com/alvaro-morillo",
  },
  {
    id: 3,
    nombre: "Romina Danelutto",
    descripcion: "Desarrolladora en constante evolucion, con mentalidad emprendedora, y enfoque en soluciones practicas. Me especializo en construir experiencias funcionales.",
    foto: "Equipo/romi.jpeg",
    github: "https://github.com/RominaDanelutto",
  },
  {
    id: 4,
    nombre: "Patricio Romero",
    descripcion: "Tengo 20 años, estudiante de desarrolo fullStack, me gusta el asado y los autos",
    foto: "Equipo/foto_32x43mm_300dpi.jpg",
    github: "https://github.com/pato1404",
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
