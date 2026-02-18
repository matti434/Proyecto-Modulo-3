import { useCallback } from "react";
import toast from "react-hot-toast";
import { usuariosApi } from "../../../Services/Api";
import { confirmarAccion } from "../../Utils/confirmacion";

const normalizar = (u) => (u && typeof u.toJSON === "function" ? u.toJSON() : u);

export const useUsuariosManagement = (
  usuarios,
  usuariosSuspendidos,
  usuarioActual,
  setUsuarios,
  setUsuariosSuspendidos,
  setUsuarioActual
) => {
  const suspenderUsuario = useCallback(
    async (id) => {
      const usuario = usuarios.find((u) => u.id === id);
      if (!usuario) return toast.error("Usuario no encontrado");
      if (usuario.role === "admin")
        return toast.error("El administrador no puede ser suspendido");

      try {
        await usuariosApi.suspender(id);
        setUsuarios((prev) => prev.filter((u) => u.id !== id));
        setUsuariosSuspendidos((prev) => [...prev, { ...usuario, fechaSuspension: new Date().toISOString() }]);
        toast.success(`Usuario ${usuario.nombreDeUsuario} suspendido`);
      } catch (err) {
        toast.error(err?.message || "Error al suspender usuario");
      }
    },
    [usuarios, setUsuarios, setUsuariosSuspendidos]
  );

  const reactivarUsuario = useCallback(
    async (id) => {
      const usuario = usuariosSuspendidos.find((u) => u.id === id);
      if (!usuario) return toast.error("Usuario no encontrado");

      try {
        await usuariosApi.reactivar(id);
        setUsuariosSuspendidos((prev) => prev.filter((u) => u.id !== id));
        setUsuarios((prev) => [...prev, { ...usuario, fechaSuspension: undefined }]);
        toast.success(`Usuario ${usuario.nombreDeUsuario} reactivado`);
      } catch (err) {
        toast.error(err?.message || "Error al reactivar usuario");
      }
    },
    [usuariosSuspendidos, setUsuarios, setUsuariosSuspendidos]
  );

  const eliminarUsuarioSuspendido = useCallback(
    async (id) => {
      const usuario = usuariosSuspendidos.find((u) => u.id === id);
      if (!usuario) return;
      if (usuario.role === "admin")
        return toast.error("El administrador no puede ser eliminado");

      const confirmar = await confirmarAccion(
        "¿Eliminar permanentemente?",
        `¿Estás seguro de eliminar a "${usuario.nombreDeUsuario}"? Esta acción no se puede deshacer.`
      );
      if (!confirmar) return toast.info("Eliminación cancelada");

      try {
        await usuariosApi.eliminar(id);
        setUsuariosSuspendidos((prev) => prev.filter((u) => u.id !== id));
        toast.success(`Usuario ${usuario.nombreDeUsuario} eliminado permanentemente`);
      } catch (err) {
        toast.error(err?.message || "Error al eliminar usuario");
      }
    },
    [usuariosSuspendidos, setUsuariosSuspendidos]
  );

  const editarUsuario = useCallback(
    async (id, nuevosDatos) => {
      try {
        const respuesta = await usuariosApi.actualizar(id, nuevosDatos);
        const usuarioJSON = normalizar(respuesta?.usuario ?? respuesta);
        if (usuarioJSON) {
          setUsuarios((prev) =>
            prev.map((u) => (u.id === id ? usuarioJSON : u))
          );
          if (usuarioActual?.id === id) {
            setUsuarioActual(usuarioJSON);
            localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioJSON));
          }
        }
        toast.success("Usuario actualizado");
      } catch (err) {
        toast.error(err?.message || "Error al actualizar usuario");
      }
    },
    [usuarioActual, setUsuarios, setUsuarioActual]
  );

  const actualizarUsuarioActual = useCallback(
    (nuevosDatos) => {
      if (!usuarioActual) return;
      const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
      setUsuarioActual(usuarioActualizado);
      localStorage.setItem("ultimoUsuario", JSON.stringify(usuarioActualizado));
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuarioActual.id ? usuarioActualizado : u))
      );
      toast.success("Perfil actualizado");
    },
    [usuarioActual, setUsuarioActual, setUsuarios]
  );

  return {
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    actualizarUsuarioActual,
  };
};
