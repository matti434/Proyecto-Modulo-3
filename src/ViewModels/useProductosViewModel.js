import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  useProductos,
  filtrarProductos,
} from "../Componentes/Context/ContextoProducto";


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


  const [busquedaLocal, setBusquedaLocal] = useState(
    filtros.terminoBusqueda || "",
  );

 
  useEffect(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  
  useEffect(() => {
    setBusquedaLocal(filtros.terminoBusqueda || "");
  }, [filtros.terminoBusqueda]);

 
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


  const categorias = useMemo(
    () => obtenerCategoriasUnicas(),
    [obtenerCategoriasUnicas],
  );


  const estadisticas = useMemo(
    () => obtenerEstadisticas(),
    [obtenerEstadisticas],
  );

 
  const rangoPrecios = useMemo(
    () => obtenerRangoPrecios(),
    [obtenerRangoPrecios],
  );


  const tieneResultados = useMemo(
    () => productosFiltrados.length > 0,
    [productosFiltrados.length],
  );

 
  const cantidadResultados = useMemo(
    () => productosFiltrados.length,
    [productosFiltrados.length],
  );


  const tieneFiltrosActivos = useMemo(() => {
    return Object.values(filtros).some((valor) => valor !== "");
  }, [filtros]);


  const buscar = useCallback(
    (termino) => {
      setBusquedaLocal(termino);
      actualizarFiltros({ terminoBusqueda: termino });
    },
    [actualizarFiltros],
  );

  const limpiarBusqueda = useCallback(() => {
    setBusquedaLocal("");
    actualizarFiltros({ terminoBusqueda: "" });
  }, [actualizarFiltros]);


  const resetearFiltros = useCallback(() => {
    setBusquedaLocal("");
    limpiarFiltros();
  }, [limpiarFiltros]);


  const filtrarPorPrecio = useCallback(
    (min, max) => {
      actualizarFiltros({
        precioMin: min?.toString() || "",
        precioMax: max?.toString() || "",
      });
    },
    [actualizarFiltros],
  );

  const filtrarPorStock = useCallback(
    (soloDisponibles) => {
      actualizarFiltros({ stock: soloDisponibles ? "true" : "" });
    },
    [actualizarFiltros],
  );

 
  const filtrarPorDestacados = useCallback(
    (soloDestacados) => {
      actualizarFiltros({ destacado: soloDestacados ? "true" : "" });
    },
    [actualizarFiltros],
  );

  const obtenerSugerencias = useCallback(
    (termino) => {
      return buscarSugerencias(termino);
    },
    [buscarSugerencias],
  );


  const aplicarCategoriaDesdeNavegacion = useCallback(() => {
    const categoriaSeleccionada = location.state?.categoriaSeleccionada;
    if (categoriaSeleccionada) {
      filtrarPorCategoria(categoriaSeleccionada);
    }
  }, [location.state, filtrarPorCategoria]);

  return {
  
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
