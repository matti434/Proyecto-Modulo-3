import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import paisesCoordenadas from "../../Componentes/Utils/CoordenadasPaises";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapaUsuarios = ({ usuarios: usuariosProp }) => {
  const [mapaListo, setMapaListo] = useState(false);
  const usuariosLocal = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuarios = Array.isArray(usuariosProp) ? usuariosProp : usuariosLocal;

  const usuariosConCoordenadas = usuarios
    .map(user => {
      const coord = paisesCoordenadas[user.pais];
      return coord ? { ...user, coordenadas: coord } : null; 
    })
    .filter(Boolean);

  useEffect(() => {
    setMapaListo(true);
  }, []);

  const centroMapa = [0, -60]; 
  const zoomInicial = 3;

  if (!mapaListo) {
    return <div style={{ 
      width: "100%", 
      height: "400px", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f5f5f5" 
    }}>
      Cargando mapa...
    </div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Mapa de Usuarios Registrados
      </h2>
      
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={centroMapa}
          zoom={zoomInicial}
          style={{ height: "100%", width: "100%" }}
        >
    
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {usuariosConCoordenadas.map((user, index) => (
            <Marker key={index} position={user.coordenadas}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong>{user.nombre || user.nombreDeUsuario}</strong>
                  <br />
                  {user.pais}
                  <br />
                  <small>{user.email}</small>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div style={{ textAlign: "center", marginTop: "10px", color: "#666" }}>
        {usuariosConCoordenadas.length} usuarios mostrados en el mapa
      </div>
    </div>
  );
};

export default MapaUsuarios;