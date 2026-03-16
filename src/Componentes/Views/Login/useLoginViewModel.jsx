import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/ContextoUsuario';

export const useLoginViewModel = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useUser();

  const iniciarSesion = useCallback(async (data) => {
    try {
      const resultado = await login(data);

      if (resultado.login) {
        toast.success("Login exitoso ✔");
        onClose();

        if (resultado.usuario.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        return { exito: true };
      } else {
        return { exito: false, mensaje: resultado.mensaje || "Error al iniciar sesión" };
      }
    } catch (error) {
      console.error("useLoginViewModel - Error:", error);
      toast.error("Error inesperado: " + error.message);
      return { exito: false, mensaje: error.message };
    }
  }, [login, onClose, navigate]);

  return {
    iniciarSesion
  };

  
};