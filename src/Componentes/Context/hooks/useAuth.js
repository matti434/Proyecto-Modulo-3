import { useCallback } from "react";
import toast from "react-hot-toast";
import { authApi } from "../../../Services/Api";

export const useAuthActions = (setUsuarioActual, setUsuarios) => {
  const login = useCallback(async (credenciales) => {
    try {
      const resultado = await authApi.login(
        credenciales.credencial,
        credenciales.contrasena
      );

      if (resultado.token || resultado.usuario) {
        const usuario = resultado.usuario || resultado;
        const usuarioJSON =
          typeof usuario.toJSON === "function" ? usuario.toJSON() : usuario;
        setUsuarioActual(usuarioJSON);
        localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
        toast.success(
          `Bienvenido ${usuarioJSON.nombreDeUsuario || usuarioJSON.nombre || "Usuario"}`
        );
        return {
          login: true,
          usuario: usuarioJSON,
          esAdmin:
            usuarioJSON.role === "admin" ||
            (typeof usuario?.esAdmin === "function" ? usuario.esAdmin() : false),
        };
      }

      toast.error(resultado.mensaje || "Credenciales incorrectas");
      return {
        login: false,
        mensaje: resultado.mensaje || "Credenciales incorrectas",
      };
    } catch (error) {
      const mensaje =
        error?.message || "Error al conectar con el servidor. Intenta de nuevo.";
      toast.error(mensaje);
      return { login: false, mensaje };
    }
  }, [setUsuarioActual]);

  const logout = useCallback(() => {
    setUsuarioActual(null);
    localStorage.removeItem("ultimoUsuario");
    authApi.logout();
    toast.success("Sesión cerrada");
  }, [setUsuarioActual]);

  const registrarUsuario = useCallback(async (datos) => {
    try {
      const resultado = await authApi.registro(datos);

      if (resultado.token || resultado.usuario) {
        const usuario = resultado.usuario || resultado;
        const usuarioJSON =
          typeof usuario.toJSON === "function" ? usuario.toJSON() : usuario;
        setUsuarios((prev) => [...prev, usuarioJSON]);
        setUsuarioActual(usuarioJSON);
        localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
        toast.success("Usuario registrado exitosamente");
        return {
          registrado: true,
          usuario: usuarioJSON,
          mensaje: "Registro exitoso",
        };
      }

      toast.error(resultado.mensaje || "Error al registrar usuario");
      return {
        registrado: false,
        mensaje: resultado.mensaje || "Error al registrar usuario",
      };
    } catch (error) {
      const mensaje =
        error?.message || "Error al conectar con el servidor. Intenta de nuevo.";
      toast.error(mensaje);
      return { registrado: false, mensaje };
    }
  }, [setUsuarioActual, setUsuarios]);

  return { login, logout, registrarUsuario };
};
