import { useState } from "react";
import { useCarrito } from "../../../../../Context/ContextoCarrito";
import { useUser } from "../../../../../Context/ContextoUsuario";
import { Modal, Button, Form, Alert, Spinner, Badge } from "react-bootstrap";
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
      <Modal 
        show={mostrar && !mostrarConfirmacion} 
        onHide={onCerrar}
        size="lg"
        centered
        className="modal-perfil"
      >
        <Modal.Header closeButton className="modal-header-perfil">
          <Modal.Title>
            <FaUser className="me-2" />
            Mi Perfil
            {esAdministrador && (
              <Badge bg="warning" className="ms-2 badge-admin">
                <FaCrown className="me-1" />
                Administrador
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="modal-body-perfil">
          <div className="perfil-info">
            <div className="info-item">
              <div className="info-icon"><FaUser /></div>
              <div className="info-content">
                <label>Nombre de Usuario</label>
                {editando ? (
                  <Form.Control
                    type="text"
                    value={formData.nombreDeUsuario}
                    onChange={(e) => setFormData({ ...formData, nombreDeUsuario: e.target.value })}
                    disabled={cargando}
                    className="input-perfil"
                  />
                ) : (
                  <div className="info-value">{usuarioActual.nombreDeUsuario}</div>
                )}
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
                <div className="info-value rol-usuario">
                  {esAdministrador ? (
                    <span className="texto-admin">
                      <FaCrown className="me-1" />
                      Administrador
                    </span>
                  ) : "Usuario"}
                </div>
              </div>
            </div>

            {esAdministrador && (
              <Alert variant="info" className="alert-info-admin">
                <Alert.Heading>
                  <FaCrown className="me-2" />
                  Cuenta de Administrador
                </Alert.Heading>
                <p className="mb-0">
                  Como administrador, tu cuenta tiene privilegios especiales y no puede ser eliminada 
                  a través de esta interfaz por razones de seguridad del sistema.
                </p>
              </Alert>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-perfil">
          {editando ? (
            <div className="botones-edicion">
              <Button 
                variant="success" 
                onClick={manejarGuardar}
                disabled={cargando}
                className="boton-guardar"
              >
                {cargando ? <Spinner animation="border" size="sm" /> : "Guardar"}
              </Button>
              <Button 
                variant="secondary" 
                onClick={manejarCancelar}
                disabled={cargando}
              >
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="botones-accion">
              <Button 
                variant="primary" 
                onClick={manejarEditar}
                className="boton-editar"
              >
                Editar Usuario
              </Button>
              
              {!esAdministrador && (
                <Button 
                  variant="outline-danger" 
                  onClick={() => setMostrarConfirmacion(true)}
                  className="boton-eliminar"
                >
                  <FaExclamationTriangle className="me-1" />
                  Eliminar Cuenta
                </Button>
              )}
            </div>
          )}
        </Modal.Footer>
      </Modal>

      {!esAdministrador && (
        <Modal 
          show={mostrar && mostrarConfirmacion} 
          onHide={() => setMostrarConfirmacion(false)}
          size="md"
          centered
          className="modal-confirmacion"
        >
          <Modal.Header closeButton className="modal-header-confirmacion">
            <Modal.Title>
              <FaExclamationTriangle className="me-2 text-danger" />
              Confirmar Eliminación
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="modal-body-confirmacion">
            <Alert variant="danger" className="alert-eliminacion">
              <Alert.Heading>¡Atención!</Alert.Heading>
              <p>Esta acción <strong>no se puede deshacer</strong>. Se eliminarán todos tus datos permanentemente.</p>
              <hr />
              <p className="mb-0">Para confirmar, ingresa tu contraseña:</p>
            </Alert>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasenaConfirmacion}
                onChange={(e) => setContrasenaConfirmacion(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={cargando}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="modal-footer-confirmacion">
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setMostrarConfirmacion(false);
                setContrasenaConfirmacion("");
              }}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={manejarEliminarCuenta}
              disabled={cargando || !contrasenaConfirmacion}
              className="boton-confirmar-eliminacion"
            >
              {cargando ? <Spinner animation="border" size="sm" /> : "Eliminar Cuenta"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ModalPerfil;
