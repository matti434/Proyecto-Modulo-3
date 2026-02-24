import { Dropdown } from "react-bootstrap";
import { useUser } from "../../../../Context/ContextoUsuario";
import { useCarrito } from "../../../../Context/ContextoCarrito";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaHeadset, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import ModalPerfil from "./Perfil/ModalPerfil";
import "./MenuUsuario.css";

const MenuUsuario = () => {
  const { usuarioActual, logout } = useUser();
  const { cargarCarritoInvitado } = useCarrito();
  const navigate = useNavigate();
  const [mostrarModalPerfil, setMostrarModalPerfil] = useState(false);

  const manejarCerrarSesion = () => {
    cargarCarritoInvitado();
    logout();
    navigate("/");
  };

  const manejarPerfil = () => {
    setMostrarModalPerfil(true);
  };

  const manejarContacto = () => {
    navigate("/contacto");
  };

  const manejarSoporte = () => {
    navigate("/404");
  };

  if (!usuarioActual) {
    return null;
  }

  return (
    <>
      <Dropdown align="end" className="menu-usuario-container">
        <Dropdown.Toggle variant="dark" className="boton-usuario d-flex align-items-center gap-2">
          <FaUser className="icono-usuario" />
          <span className="nombre-usuario">{usuarioActual.nombreDeUsuario}</span>
        </Dropdown.Toggle>

        <Dropdown.Menu className="menu-desplegable-usuario">
          <Dropdown.Item onClick={manejarPerfil} className="item-menu-usuario">
            <FaUser className="me-2" />
            Perfil
          </Dropdown.Item>
          
          <Dropdown.Item onClick={manejarContacto} className="item-menu-usuario">
            <FaEnvelope className="me-2" />
            Contacto
          </Dropdown.Item>
          
          <Dropdown.Item onClick={manejarSoporte} className="item-menu-usuario">
            <FaHeadset className="me-2" />
            Soporte
          </Dropdown.Item>
          
          <Dropdown.Divider className="divisor-menu" />
          
          <Dropdown.Item onClick={manejarCerrarSesion} className="item-menu-usuario item-salir">
            <FaSignOutAlt className="me-2" />
            Cerrar Sesión
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ModalPerfil 
        mostrar={mostrarModalPerfil}
        onCerrar={() => setMostrarModalPerfil(false)}
      />
    </>
  );
};

export default MenuUsuario;