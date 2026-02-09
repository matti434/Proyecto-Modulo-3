import { useCallback } from "react";
import toast from "react-hot-toast";
import { usuarioService } from "../../../Services";
import { confirmarAccion } from "../../Utils/confirmacion";

export const useUsuariosManagement = (
  usuarios,
  usuariosSuspendidos,
  usuarioActual,
  setUsuarios,
  setUsuariosSuspendidos,
  setUsuarioActual
) => {
  const suspenderUsuario = useCallback((id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return toast.error("Usuario no encontrado");
    if (usuario.role === "admin") return toast.error("El administrador no puede ser suspendido");

    const respuesta = usuarioService.suspender(id);
    if (respuesta.exito) {
      const usuarioJSON = respuesta.usuario.toJSON ? respuesta.usuario.toJSON() : respuesta.usuario;
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setUsuariosSuspendidos(prev => [...prev, usuarioJSON]);
      toast.success(`Usuario ${usuario.nombreDeUsuario} suspendido`);
    } else {
      toast.error("Error al suspender usuario");
    }
  }, [usuarios, setUsuarios, setUsuariosSuspendidos]);

  const reactivarUsuario = useCallback((id) => {
    const usuario = usuariosSuspendidos.find(u => u.id === id);
    if (!usuario) return toast.error("Usuario no encontrado");

    const respuesta = usuarioService.reactivar(id);
    if (respuesta.exito) {
      const usuarioJSON = respuesta.usuario.toJSON ? respuesta.usuario.toJSON() : respuesta.usuario;
      setUsuariosSuspendidos(prev => prev.filter(u => u.id !== id));
      setUsuarios(prev => [...prev, usuarioJSON]);
      toast.success(`Usuario ${usuario.nombreDeUsuario} reactivado`);
    } else {
      toast.error("Error al reactivar usuario");
    }
  }, [usuariosSuspendidos, setUsuarios, setUsuariosSuspendidos]);

  const eliminarUsuarioSuspendido = useCallback(async (id) => {
    const usuario = usuariosSuspendidos.find(u => u.id === id);
    if (!usuario) return;

    if (usuario.role === "admin") return toast.error("El administrador no puede ser eliminado");

    const confirmar = await confirmarAccion(
        "¿Eliminar permanentemente?",
        `¿Estás seguro de eliminar a "${usuario.nombreDeUsuario}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) {
        return toast.info("Eliminación cancelada");
    }
    const respuesta = await usuarioService.eliminarSuspendido(id);
    if (respuesta.exito) {
        setUsuariosSuspendidos(prev => prev.filter(u => u.id !== id));
        toast.success(`Usuario ${usuario.nombreDeUsuario} eliminado permanentemente`);
    } else {
        toast.error("Error al eliminar usuario");
    }
}, [usuariosSuspendidos, setUsuariosSuspendidos, confirmarAccion]);

  const editarUsuario = useCallback((id, nuevosDatos) => {
    const respuesta = usuarioService.actualizar(id, nuevosDatos);
    if (respuesta.exito) {
      const usuarioJSON = respuesta.usuario.toJSON ? respuesta.usuario.toJSON() : respuesta.usuario;
      setUsuarios(prev => prev.map(u => u.id === id ? usuarioJSON : u));
      if (usuarioActual && usuarioActual.id === id) {
        setUsuarioActual(usuarioJSON);
        localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
      }
      toast.success("Usuario actualizado");
    } else {
      toast.error("Error al actualizar usuario");
    }
  }, [usuarioActual, setUsuarios, setUsuarioActual]);

  const actualizarUsuarioActual = useCallback((nuevosDatos) => {
    if (!usuarioActual) return;
    const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioActualizado));
    setUsuarios(prev => prev.map(u => u.id === usuarioActual.id ? usuarioActualizado : u));
    toast.success("Perfil actualizado");
  }, [usuarioActual, setUsuarioActual, setUsuarios]);

  return {
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    actualizarUsuarioActual
  };
};
