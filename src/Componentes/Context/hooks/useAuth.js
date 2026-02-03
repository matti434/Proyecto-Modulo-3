import { useCallback } from "react";
import toast from "react-hot-toast";
import { usuarioService } from "../../../Services";

export const useAuthActions = (setUsuarioActual, setUsuarios) => {
  const login = useCallback((credenciales) => {
    const resultado = usuarioService.login(credenciales.credencial, credenciales.contrasena);

    if (resultado.exito) {
      const usuario = resultado.usuario; // Es una instancia de Usuario (Model)
      const usuarioJSON = usuario.toJSON ? usuario.toJSON() : usuario;
      setUsuarioActual(usuarioJSON);
      localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
      toast.success(`Bienvenido ${usuario.nombreDeUsuario}`);

      return {
        login: true,
        usuario: usuarioJSON,
        esAdmin: usuario.esAdmin ? usuario.esAdmin() : usuario.role === "admin"
      };
    } else {
      toast.error(resultado.mensaje || "Credenciales incorrectas");
      return { login: false, mensaje: resultado.mensaje || "Credenciales incorrectas" };
    }
  }, [setUsuarioActual]);

  const logout = useCallback(() => {
    setUsuarioActual(null);
    localStorage.removeItem("ultimoUsuario");
    toast.success("Sesión cerrada");
  }, [setUsuarioActual]);

  const registrarUsuario = useCallback((datos) => {
    // Usa usuarioService que tiene validaciones y convierte a Model
    const respuesta = usuarioService.registrar(datos);
    if (respuesta.exito) {
      const usuario = respuesta.usuario; // Es una instancia de Usuario (Model)
      const usuarioJSON = usuario.toJSON ? usuario.toJSON() : usuario;
      setUsuarios(prev => [...prev, usuarioJSON]);
      setUsuarioActual(usuarioJSON);
      localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
      toast.success("Usuario registrado exitosamente");
      return { registrado: true, usuario: usuarioJSON, mensaje: "Registro exitoso" };
    } else {
      toast.error(respuesta.mensaje || "Error al registrar usuario");
      return { registrado: false, mensaje: respuesta.mensaje || "Error al registrar usuario" };
    }
  }, [setUsuarioActual, setUsuarios]);

  return { login, logout, registrarUsuario };
};
