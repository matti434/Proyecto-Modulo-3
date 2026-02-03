import { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { usuarioService } from "../../Services";
import { useAuthActions } from "./hooks/useAuth";
import { useUsuariosManagement } from "./hooks/useUsuariosManagement";
import { useUsuarioDataActions } from "./hooks/useUsuarioData";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosSuspendidos, setUsuariosSuspendidos] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = useCallback(() => {
    try {
      setCargando(true);

      const usuariosData = usuarioService.obtenerTodos();
      const suspendidosData = usuarioService.obtenerSuspendidos();

      // Convertir Models a JSON para el estado
      const dataUsuarios = usuariosData.map(u => u.toJSON ? u.toJSON() : u);
      const dataSuspendidos = suspendidosData.map(u => u.toJSON ? u.toJSON() : u);

      setUsuarios(dataUsuarios);
      setUsuariosSuspendidos(dataSuspendidos);

      const ultimo = JSON.parse(localStorage.getItem("ultimoUsuario") || "null");
      if (ultimo) {
        const usuarioValido = dataUsuarios.find(u => u.id === ultimo.id);
        if (usuarioValido) {
          setUsuarioActual(usuarioValido);
        } else {
          localStorage.removeItem("ultimoUsuario");
        }
      }
    } catch {
      toast.error("Error al cargar usuarios desde LocalStorage");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const { login, logout, registrarUsuario } = useAuthActions(setUsuarioActual, setUsuarios);
  
  const {
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    actualizarUsuarioActual
  } = useUsuariosManagement(
    usuarios,
    usuariosSuspendidos,
    usuarioActual,
    setUsuarios,
    setUsuariosSuspendidos,
    setUsuarioActual
  );

  const { obtenerUsuarioPorId, buscarUsuarios } = useUsuarioDataActions();

  const sincronizarConAPI = useCallback(() => {
    cargarDatos();
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
        actualizarUsuarioActual
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
