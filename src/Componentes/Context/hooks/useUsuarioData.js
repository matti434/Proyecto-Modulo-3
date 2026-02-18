import { useCallback } from "react";
import { usuariosApi } from "../../../Services/Api";

export const useUsuarioDataActions = () => {
  const obtenerUsuarioPorId = useCallback(async (id) => {
    const data = await usuariosApi.obtenerPorId(id);
    return data?.usuario ?? data ?? null;
  }, []);

  const buscarUsuarios = useCallback(async (termino) => {
    const data = await usuariosApi.buscar(termino);
    const lista = Array.isArray(data) ? data : data?.usuarios ?? [];
    return lista;
  }, []);

  return { obtenerUsuarioPorId, buscarUsuarios };
};
