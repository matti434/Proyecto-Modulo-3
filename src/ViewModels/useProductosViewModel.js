import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useProductos,
  filtrarProductos,
} from "../Componentes/Context/ContextoProducto";

/**
 * ViewModel para la página de productos
 * Maneja la lógica de filtrado y presentación
 */
export const useProductosViewModel = () => {
  const location = useLocation();
  const {
    productos: productosOriginales,
    cargando,
    filtros,
    actualizarFiltros,
    limpiarFiltros,
    filtrarPorCategoria,
    obtenerCategoriasUnicas,
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria,
    obtenerEstadisticas,
    obtenerRangoPrecios,
    buscarSugerencias,
  } = useProductos();

  // Estado local para búsqueda (sincronizado con filtros)
  const [busquedaLocal, setBusquedaLocal] = useState(
    filtros.terminoBusqueda || "",
  );

  // Aplicar categoría desde navegación
  useEffect(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  // Sincronizar búsqueda local con filtros
  useEffect(() => {
    setBusquedaLocal(filtros.terminoBusqueda || "");
  }, [filtros.terminoBusqueda]);

  /**
   * Productos filtrados - La lógica de filtrado se ejecuta aquí en el ViewModel
   * El contexto solo provee los datos crudos y los filtros
   */
  const productosFiltrados = useMemo(() => {
    return filtrarProductos(productosOriginales, filtros);
  }, [productosOriginales, filtros]);

  const PRODUCTOS_POR_PAGINA = 5;

  const [paginaActual, setPaginaActual] = useState(1);
  useEffect(() => {
    setPaginaActual(1);
  }, [filtros, location.state?.categoriaSeleccionada]);
  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    return productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA);
  }, [productosFiltrados, paginaActual]);
  const totalPaginas = useMemo(
    () =>
      Math.max(1, Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA)),
    [productosFiltrados.length],
  );

  const irAPagina = useCallback(
    (pagina) => {
      setPaginaActual((prev) => Math.min(totalPaginas, Math.max(1, pagina)));
    },
    [totalPaginas],
  );

  // Categorías disponibles
  const categorias = useMemo(
    () => obtenerCategoriasUnicas(),
    [obtenerCategoriasUnicas],
  );

  // Estadísticas de productos
  const estadisticas = useMemo(
    () => obtenerEstadisticas(),
    [obtenerEstadisticas],
  );

  // Rango de precios
  const rangoPrecios = useMemo(
    () => obtenerRangoPrecios(),
    [obtenerRangoPrecios],
  );

  // Indicador de resultados
  const tieneResultados = useMemo(
    () => productosFiltrados.length > 0,
    [productosFiltrados.length],
  );

  // Cantidad de resultados
  const cantidadResultados = useMemo(
    () => productosFiltrados.length,
    [productosFiltrados.length],
  );

  // Verificar si hay filtros activos
  const tieneFiltrosActivos = useMemo(() => {
    return Object.values(filtros).some((valor) => valor !== "");
  }, [filtros]);

  /**
   * Buscar productos por término
   */
  const buscar = useCallback(
    (termino) => {
      setBusquedaLocal(termino);
      actualizarFiltros({ terminoBusqueda: termino });
    },
    [actualizarFiltros],
  );

  /**
   * Limpiar búsqueda
   */
  const limpiarBusqueda = useCallback(() => {
    setBusquedaLocal("");
    actualizarFiltros({ terminoBusqueda: "" });
  }, [actualizarFiltros]);

  /**
   * Limpiar todos los filtros
   */
  const resetearFiltros = useCallback(() => {
    setBusquedaLocal("");
    limpiarFiltros();
  }, [limpiarFiltros]);

  /**
   * Filtrar por rango de precio
   */
  const filtrarPorPrecio = useCallback(
    (min, max) => {
      actualizarFiltros({
        precioMin: min?.toString() || "",
        precioMax: max?.toString() || "",
      });
    },
    [actualizarFiltros],
  );

  /**
   * Filtrar por stock
   */
  const filtrarPorStock = useCallback(
    (soloDisponibles) => {
      actualizarFiltros({ stock: soloDisponibles ? "true" : "" });
    },
    [actualizarFiltros],
  );

  /**
   * Filtrar por destacados
   */
  const filtrarPorDestacados = useCallback(
    (soloDestacados) => {
      actualizarFiltros({ destacado: soloDestacados ? "true" : "" });
    },
    [actualizarFiltros],
  );

  /**
   * Obtener sugerencias de búsqueda
   */
  const obtenerSugerencias = useCallback(
    (termino) => {
      return buscarSugerencias(termino);
    },
    [buscarSugerencias],
  );

  /**
   * Aplicar categoría desde navegación (útil para re-aplicar)
   */
  const aplicarCategoriaDesdeNavegacion = useCallback(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  return {
    // Datos
    productos: productosPaginados,
    productosOriginales,
    categorias,
    estadisticas,
    rangoPrecios,
    cantidadResultados,
    paginaActual,
    totalPaginas,
    productosPorPagina: PRODUCTOS_POR_PAGINA,
    // Estado
    cargando,
    filtros,
    busquedaLocal,
    tieneResultados,
    tieneFiltrosActivos,
    // Acciones de búsqueda
    buscar,
    limpiarBusqueda,
    obtenerSugerencias,
    // Acciones de filtros
    actualizarFiltros,
    filtrarPorCategoria,
    filtrarPorPrecio,
    filtrarPorStock,
    filtrarPorDestacados,
    resetearFiltros,
    // Paginación
    irAPagina,
    // Utilidades
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria,
    aplicarCategoriaDesdeNavegacion,
  };
};
