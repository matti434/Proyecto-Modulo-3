import { Modal } from "react-bootstrap";
import FormRegistro from "./FormRegistro/FormRegistro";
import { useRegistroViewModel } from "./useRegistroViewModel";
import "./Registro.css";

export const Registro = ({ onClose, onAbrirLogin }) => {
  const { registrarUsuario } = useRegistroViewModel({ onClose });

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      backdrop={false}
      keyboard={false}
      dialogClassName="modal-registro-moderno"
    >
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-container">
        <button className="btn-cerrar-moderno" onClick={onClose}>
          ×
        </button>
        
        <div className="encabezado-registro">
          <h2 className="titulo-registro">¿Qué esperas para ser amante de Rolling Motors?</h2>
          <p className="subtitulo-registro">Completa todos los campos para crear tu cuenta</p>
        </div>

        <div className="cuerpo-registro">
          <FormRegistro 
            onSubmit={registrarUsuario} 
            onClose={onClose} 
            onAbrirLogin={onAbrirLogin}
          />
        </div>
      </div>
    </Modal>
  );
};
