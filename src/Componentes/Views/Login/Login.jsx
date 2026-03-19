import { Modal } from "react-bootstrap";
import FormLogin from "./FormLogin/FormLogin";
import { useLoginViewModel } from "./useLoginViewModel";
import "./Login.css";

const Login = ({ onClose, onAbrirRegistro, esPagina = false, redirect = "/" }) => {
  const { iniciarSesion } = useLoginViewModel({ onClose, redirect });

  if (esPagina) {
    return (
      <div className="login-pagina-container min-vh-100 d-flex align-items-center justify-content-center py-5">
        <div className="login-pagina-card shadow-lg rounded-4 p-4 p-md-5">
          <h2 className="titulo-login mb-2">Tu camino continúa en Rolling Motors</h2>
          <p className="subtitulo-login text-muted mb-4">
            Ingresa tus credenciales para acceder
          </p>
          <FormLogin
            onSubmit={iniciarSesion}
            onClose={onClose}
            onAbrirRegistro={onAbrirRegistro}
          />
        </div>
      </div>
    );
  }

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      backdrop={false}
      keyboard={false}
      dialogClassName="modal-login-moderno"
    >
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <button className="btn-cerrar-moderno" onClick={onClose}>
          ×
        </button>

        <div className="encabezado-login">
          <h2 className="titulo-login">Tu camino continúa en Rolling Motors</h2>
          <p className="subtitulo-login">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <div className="cuerpo-login">
          <FormLogin
            onSubmit={iniciarSesion}
            onClose={onClose}
            onAbrirRegistro={onAbrirRegistro}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Login;
