import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { homeApi } from "../../../Services/Api/homeApi";
import "./Nosotros.css";
const Nosotros = () => {
const [equipo, setEquipo] = useState([]);
const [cargando, setCargando] = useState(true);
const [error, setError] = useState(null);
useEffect(() => {
let cancel = false;
const cargar = async () => {
try {
const data = await homeApi.obtenerContenidoHome();
if (!cancel && Array.isArray(data.equipo)) {
setEquipo(data.equipo);
}
} catch (e) {
if (!cancel) setError(e?.message || "Error al cargar el equipo");
} finally {
if (!cancel) setCargando(false);
}
};
cargar();
return () => { cancel = true; };
}, []);
if (cargando) return <div className="nosotros-contenedor mt-5"><p>Cargando 
equipo...</p></div>;
if (error) return <div className="nosotros-contenedor mt-5"><p role="alert">
{error}</p></div>;
if (equipo.length === 0) return <div className="nosotros-contenedor mt-5"><p>No 
hay integrantes.</p></div>;
return (
<div className="nosotros-contenedor mt-5">
<h1 className="titulo-nosotros">Nuestro Equipo</h1>
<div className="grid-integrantes">
{equipo.map((persona) => (
<div className="tarjeta-integrante" key={persona.id ?? persona._id}>
{persona.imagenUrl && (
<div className="tarjeta-integrante-imagen-wrapper">
<img
src={persona.imagenUrl}
alt={persona.nombre ?? "Integrante"}
className="tarjeta-integrante-imagen"
/>
</div>
)}
<h3>{persona.nombre}</h3>
<p className="rol-integrante">{persona.rol}</p>
<p className="descripcion-integrante">{persona.descripcion}</p>
<a
>
href={persona.github}
target="_blank"
className="link-github"
rel="noopener noreferrer"
<FaGithub size={25} /> GitHub
</a>
</div>
))}
</div>
</div>
);
};
export default Nosotros;