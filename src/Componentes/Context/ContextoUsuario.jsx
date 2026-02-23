import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { authApi } from "../../Services/Api";
import { usuariosApi } from "../../Services/Api";
import { useAuthActions } from "./hooks/useAuth";
import { useUsuariosManagement } from "./hooks/useUsuariosManagement";
import { useUsuarioDataActions } from "./hooks/useUsuarioData";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const normalizarUsuario = (u) =>
  u && typeof u.toJSON === "function" ? u.toJSON() : u;

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSuspendidos, setUsuariosSuspendidos] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);

      // Primero comprobar si hay sesión (perfil). Si no hay, no llamar a usuarios (evita 401 en primera visita).
      let perfil = null;
      try {
        perfil = await authApi.obtenerPerfil();
      } catch (err) {
        // Sin sesión (401 o error): tratar como no autenticado para no dejar estado inconsistente.
        setUsuarios([]);
        setUsuariosSuspendidos([]);
        if (err?.status === 401) {
          setUsuarioActual(null);
          localStorage.removeItem("ultimoUsuario");
        } else {
          const ultimo = JSON.parse(localStorage.getItem("ultimoUsuario") || "null");
          if (ultimo) setUsuarioActual(ultimo);
          else setUsuarioActual(null);
        }
        setCargando(false);
        return;
      }

      const usuarioJSON = normalizarUsuario(perfil?.usuario ?? perfil);
      if (usuarioJSON) setUsuarioActual(usuarioJSON);

      // Solo si hay sesión, cargar listas de usuarios (endpoints que requieren auth).
      const [dataUsuarios, dataSuspendidos] = await Promise.all([
        usuariosApi.obtenerTodos(true),
        usuariosApi.obtenerSuspendidos(),
      ]);

      const rawUsuarios = Array.isArray(dataUsuarios)
        ? dataUsuarios
        : dataUsuarios?.datos ?? dataUsuarios?.usuarios ?? dataUsuarios?.data ?? [];
      const rawSuspendidos = Array.isArray(dataSuspendidos)
        ? dataSuspendidos
        : dataSuspendidos?.datos ?? dataSuspendidos?.usuarios ?? dataSuspendidos?.data ?? [];
      const listaUsuarios = rawUsuarios.map(normalizarUsuario);
      const listaSuspendidos = rawSuspendidos.map(normalizarUsuario);

      setUsuarios(listaUsuarios);
      setUsuariosSuspendidos(listaSuspendidos);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      toast.error(
        err?.message || "Error al cargar usuarios. Verifica que el backend esté disponible."
      );
      setUsuarios([]);
      setUsuariosSuspendidos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const { login, logout, registrarUsuario } = useAuthActions(
    setUsuarioActual,
    setUsuarios,
    cargarDatos
  );

  const {
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    actualizarUsuarioActual,
  } = useUsuariosManagement(
    usuarios,
    usuariosSuspendidos,
    usuarioActual,
    setUsuarios,
    setUsuariosSuspendidos,
    setUsuarioActual
  );

  const { obtenerUsuarioPorId, buscarUsuarios } = useUsuarioDataActions();

  const sincronizarConAPI = useCallback(async () => {
    await cargarDatos();
    return { exito: true, mensaje: "Datos sincronizados correctamente" };
  }, [cargarDatos]);

  return (
    <UserContext.Provider
      value={{
        usuarios,
        usuariosSuspendidos,
        usuarioActual,
        cargando,
        esAdministrador: usuarioActual?.role === "admin",
        estaAutenticado: !!usuarioActual,

        login,
        logout,
        registrarUsuario,
        suspenderUsuario,
        reactivarUsuario,
        eliminarUsuarioSuspendido,
        editarUsuario,
        obtenerUsuarioPorId,
        buscarUsuarios,
        sincronizarConAPI,
        cargarDatos,
        setUsuarioActual,
        actualizarUsuarioActual,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
