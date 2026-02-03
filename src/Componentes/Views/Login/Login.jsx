import { Modal } from "react-bootstrap";
import FormLogin from "./FormLogin/FormLogin";
import { useLoginViewModel } from "./useLoginViewModel";
import "./Login.css";

const Login = ({ onClose, onAbrirRegistro }) => {
  const { iniciarSesion } = useLoginViewModel({ onClose });

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
