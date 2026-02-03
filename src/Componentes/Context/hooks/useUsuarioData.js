import { useCallback } from "react";
import { usuarioService } from "../../../Services";

export const useUsuarioDataActions = () => {
  const obtenerUsuarioPorId = useCallback((id) => usuarioService.obtenerPorId(id), []);
  const buscarUsuarios = useCallback((termino) => usuarioService.buscar(termino), []);

  return { obtenerUsuarioPorId, buscarUsuarios };
};
