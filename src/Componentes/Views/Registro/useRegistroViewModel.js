import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useUser } from '../../Context/ContextoUsuario';
import { usuarioService } from '../../../Services';

export const useRegistroViewModel = ({ onClose }) => {
  const { setUsuarioActual } = useUser();

  const registrarUsuario = useCallback(async (data) => {
    try {
      const resultado = usuarioService.registrar(data);

      if (resultado.exito) {
        toast.success("¡Registro exitoso! Bienvenido a Rolling Motors");
        
        // resultado.usuario es una instancia de Usuario (Model)
        const usuarioJSON = resultado.usuario.toJSON 
          ? resultado.usuario.toJSON() 
          : resultado.usuario;
        
        setUsuarioActual(usuarioJSON);
        onClose();
        
        return { exito: true };
      } else {
        toast.error(resultado.mensaje || "No se pudo registrar el usuario");
        return { exito: false, mensaje: resultado.mensaje };
      }
    } catch (error) {
      console.error("useRegistroViewModel - Error:", error);
      toast.error("Error inesperado: " + error.message);
      return { exito: false, mensaje: error.message };
    }
  }, [setUsuarioActual, onClose]);

  return {
    registrarUsuario
  };
};
