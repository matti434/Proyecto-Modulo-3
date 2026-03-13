import { useState } from "react";
import { useCarrito } from "../../../../../Context/ContextoCarrito";
import { useUser } from "../../../../../Context/ContextoUsuario";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { 
  FaUser, 
  FaEnvelope, 
  FaGlobeAmericas, 
  FaCalendarAlt, 
  FaKey, 
  FaExclamationTriangle,
  FaCrown 
} from "react-icons/fa";
import toast from "react-hot-toast";
import { usuariosApi } from "../../../../../../Services/Api";
import "../../../../../../estilos/variables.css";
import "./ModalPerfil.css";

const ModalPerfil = ({ mostrar, onCerrar }) => {
  const { usuarioActual, logout, editarUsuario } = useUser();
  const { cargarCarritoInvitado } = useCarrito();
  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [formData, setFormData] = useState({
    nombreDeUsuario: usuarioActual?.nombreDeUsuario || ""
  });
  const [contrasenaConfirmacion, setContrasenaConfirmacion] = useState("");

  const esAdministrador = usuarioActual?.role === "admin";

  const manejarEditar = () => {
    setEditando(true);
    setFormData({
      nombreDeUsuario: usuarioActual.nombreDeUsuario
    });
  };

  const manejarCancelar = () => {
    setEditando(false);
    setFormData({
      nombreDeUsuario: usuarioActual.nombreDeUsuario
    });
  };

  const manejarGuardar = async () => {
    if (!formData.nombreDeUsuario.trim()) {
      toast.error("El nombre de usuario no puede estar vacío");
      return;
    }

    if (formData.nombreDeUsuario === usuarioActual.nombreDeUsuario) {
      setEditando(false);
      return;
    }

    setCargando(true);
    try {
      await editarUsuario(usuarioActual.id, {
        nombreDeUsuario: formData.nombreDeUsuario
      });
      setEditando(false);
    } catch {
      toast.error("Error al actualizar el nombre de usuario");
    } finally {
      setCargando(false);
    }
  };

  const manejarEliminarCuenta = async () => {
    if (!contrasenaConfirmacion) {
      toast.error("Por favor ingresa tu contraseña para confirmar");
      return;
    }

    if (usuarioActual.contrasena && contrasenaConfirmacion !== usuarioActual.contrasena) {
      toast.error("Contraseña incorrecta");
      return;
    }

    setCargando(true);
    try {
      await usuariosApi.eliminar(usuarioActual.id);
      localStorage.removeItem("ultimoUsuario");
      toast.success("Cuenta eliminada correctamente");
      setTimeout(() => {
        cargarCarritoInvitado();
        logout();
        onCerrar();
        window.location.href = "/";
      }, 1000);
    } catch (err) {
      toast.error(err?.message || "Error al eliminar la cuenta");
    } finally {
      setCargando(false);
      setMostrarConfirmacion(false);
      setContrasenaConfirmacion("");
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!usuarioActual) return null;

  return (
    <>
      <Modal show={mostrar} onHide={onCerrar} size="lg" centered className="modal-perfil">
        <Modal.Header closeButton className="modal-header-perfil">
          <Modal.Title>
            <FaUser className="me-2" />
            Mi Perfil
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-perfil">

          <div className="perfil-info">

            <div className="info-item">
              <div className="info-icon"><FaUser /></div>
              <div className="info-content">
                <label>Nombre de Usuario</label>
                <div className="info-value">{usuarioActual.nombreDeUsuario}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FaEnvelope /></div>
              <div className="info-content">
                <label>Email</label>
                <div className="info-value">{usuarioActual.email}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FaGlobeAmericas /></div>
              <div className="info-content">
                <label>País</label>
                <div className="info-value">{usuarioActual.pais}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FaCalendarAlt /></div>
              <div className="info-content">
                <label>Fecha de Nacimiento</label>
                <div className="info-value">{formatearFecha(usuarioActual.fechaNacimiento)}</div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon"><FaKey /></div>
              <div className="info-content">
                <label>Rol</label>
                <div className="info-value">
                  {esAdministrador ? "Administrador" : "Usuario"}
                </div>
              </div>
            </div>

          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={manejarEditar}>
            Editar Usuario
          </Button>

          <Button variant="outline-danger" onClick={() => setMostrarConfirmacion(true)}>
            Eliminar Cuenta
          </Button>
        </Modal.Footer>

      </Modal>
    </>
  );
};

export default ModalPerfil;