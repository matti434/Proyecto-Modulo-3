import { useCallback } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "../../Context/ContextoUsuario";
import { authApi } from "../../../Services/Api";

export const useRegistroViewModel = ({ onClose }) => {
  const { setUsuarioActual } = useUser();

  const registrarUsuario = useCallback(
    async (data) => {
      try {
        const resultado = await authApi.registro(data);

        if (resultado.token || resultado.usuario) {
          toast.success("¡Registro exitoso! Bienvenido a Rolling Motors");
          const usuario =
            resultado.usuario && typeof resultado.usuario.toJSON === "function"
              ? resultado.usuario.toJSON()
              : resultado.usuario ?? resultado;
          if (usuario) {
            setUsuarioActual(usuario);
            localStorage.setItem("ultimoUsuario", JSON.stringify(usuario));
          }
          onClose();
          return { exito: true };
        }

        toast.error(resultado.mensaje || "No se pudo registrar el usuario");
        return { exito: false, mensaje: resultado.mensaje };
      } catch (error) {
        console.error("useRegistroViewModel - Error:", error);
        toast.error(error?.message || "Error inesperado al registrar");
        return { exito: false, mensaje: error?.message };
      }
    },
    [setUsuarioActual, onClose]
  );

  return { registrarUsuario };
};
