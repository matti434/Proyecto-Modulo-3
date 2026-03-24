import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useProductos } from "../../../../../Context/ContextoProducto";
import {
  configuracionValidaciones,
  limpiarTodosLosFiltros,
  prevenirCaracteresInvalidos,
  validarCampoNumerico,
  validarTerminoBusqueda,
  validarTodosLosFiltros,
} from "../../../../../Utils/ValidacionesBuscador";

export function useBuscadorProducto() {
  const { productos, filtros, actualizarFiltros, limpiarFiltros, obtenerCategoriasUnicas } = useProductos();

  const [filtrosLocales, setFiltrosLocales] = useState({
    terminoBusqueda: filtros.terminoBusqueda,
    categoria: filtros.categoria,
    precioMin: filtros.precioMin,
    precioMax: filtros.precioMax,
    marca: filtros.marca,
    modelo: filtros.modelo,
  });

  const [errores, setErrores] = useState({});

  const categoriasUnicas = obtenerCategoriasUnicas();
  const marcasUnicas = [...new Set(productos.map((p) => p.marca))];
  const modelosUnicos = [...new Set(productos.map((p) => p.modelo))];

  useEffect(() => {
    setFiltrosLocales({
      terminoBusqueda: filtros.terminoBusqueda,
      categoria: filtros.categoria,
      precioMin: filtros.precioMin,
      precioMax: filtros.precioMax,
      marca: filtros.marca,
      modelo: filtros.modelo,
    });
  }, [filtros]);

  const mostrarNotificacion = (mensaje, tipo = "error", duracion = 4000) => {
    const opciones = {
      duration: duracion,
      position: "top-right",
      style: {
        background: "var(--color-oscuro)",
        color: "var(--color-crema)",
        fontWeight: "500",
        borderRadius: "8px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        border: "1px solid var(--color-dorado)",
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      },
      iconTheme: {
        primary: "var(--color-crema)",
        secondary: "var(--color-oscuro)",
      },
    };
    const estilosPorTipo = {
      success: {
        background: "linear-gradient(135deg, var(--color-dorado), #b8941f)",
        borderLeft: "4px solid #f8f4e9",
        color: "var(--color-oscuro)",
        icon: "✅",
      },
      error: {
        background: "linear-gradient(135deg, var(--color-rojo), #6a0000)",
        borderLeft: "4px solid #d4af37",
        color: "var(--color-crema)",
        icon: "❌",
      },
      warning: {
        background: "linear-gradient(135deg, var(--color-metal), #6e6e6e)",
        borderLeft: "4px solid var(--color-dorado)",
        color: "var(--color-crema)",
        icon: "⚠️",
      },
      info: {
        background: "linear-gradient(135deg, var(--color-oscuro), #000)",
        borderLeft: "4px solid var(--color-dorado)",
        color: "var(--color-crema)",
        icon: "ℹ️",
      },
    };
    const estilo = estilosPorTipo[tipo] || estilosPorTipo.error;
    toast(mensaje, {
      ...opciones,
      icon: estilo.icon,
      style: {
        ...opciones.style,
        background: estilo.background,
        color: estilo.color,
        borderLeft: estilo.borderLeft,
        fontWeight: "600",
      },
    });
  };

  const manejarCambioFiltro = (campo, valor) => {
    let valorValidado = valor;
    if (campo === "terminoBusqueda") {
      valorValidado = validarTerminoBusqueda(valor);
      if (valor !== valorValidado && valor.length > valorValidado.length) {
        mostrarNotificacion("Se eliminaron caracteres especiales no permitidos", "warning", 3000);
      }
    } else if (campo === "precioMin" || campo === "precioMax") {
      valorValidado = validarCampoNumerico(valor);
      if (valor !== valorValidado && /\D/.test(valor)) {
        mostrarNotificacion("Solo se permiten números enteros", "warning", 3000);
      }
    } else {
      valorValidado = valor.trim();
    }
    setFiltrosLocales((prev) => ({ ...prev, [campo]: valorValidado }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const manejarAplicarFiltros = (e) => {
    e.preventDefault();
    const nuevosErrores = validarTodosLosFiltros(filtrosLocales);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      const mensajesError = Object.values(nuevosErrores).filter(
        (msg, index, self) => self.indexOf(msg) === index
      );
      if (mensajesError.length > 0) {
        mostrarNotificacion(
          `Corrige los siguientes errores: ${mensajesError.join(" | ")}`,
          "error",
          6000
        );
      }
      return;
    }
    const filtrosLimpios = limpiarTodosLosFiltros(filtrosLocales);
    actualizarFiltros(filtrosLimpios);
    setErrores({});
    const filtrosAplicados = [];
    if (filtrosLimpios.terminoBusqueda) filtrosAplicados.push(`"${filtrosLimpios.terminoBusqueda}"`);
    if (filtrosLimpios.categoria) filtrosAplicados.push(filtrosLimpios.categoria);
    if (filtrosLimpios.precioMin || filtrosLimpios.precioMax) {
      const min = filtrosLimpios.precioMin || "0";
      const max = filtrosLimpios.precioMax || "∞";
      filtrosAplicados.push(`$${min}-${max}`);
    }
    if (filtrosLimpios.marca) filtrosAplicados.push(filtrosLimpios.marca);
    if (filtrosLimpios.modelo) filtrosAplicados.push(filtrosLimpios.modelo);
    const mensajeExito =
      filtrosAplicados.length > 0
        ? `Filtros aplicados: ${filtrosAplicados.join(" • ")}`
        : "Mostrando todos los productos";
    mostrarNotificacion(mensajeExito, "success");
  };

  const manejarLimpiarFiltros = () => {
    setFiltrosLocales({
      terminoBusqueda: "",
      categoria: "",
      precioMin: "",
      precioMax: "",
      marca: "",
      modelo: "",
    });
    setErrores({});
    limpiarFiltros();
    mostrarNotificacion("Todos los filtros han sido restablecidos", "info");
  };

  const manejarBusquedaEnTiempoReal = (termino) => {
    const terminoLimpio = validarTerminoBusqueda(termino);
    setFiltrosLocales((prev) => ({ ...prev, terminoBusqueda: terminoLimpio }));
    if (terminoLimpio.length >= 3 || terminoLimpio === "") {
      actualizarFiltros({
        terminoBusqueda: terminoLimpio,
        categoria: filtrosLocales.categoria,
      });
    } else if (terminoLimpio.length > 0 && terminoLimpio.length < 3) {
      setTimeout(() => {
        mostrarNotificacion("Ingresa al menos 3 caracteres para buscar", "info", 2000);
      }, 800);
    }
  };

  const manejarCambioCategoria = (categoria) => {
    setFiltrosLocales((prev) => ({ ...prev, categoria }));
    actualizarFiltros({
      categoria,
      terminoBusqueda: filtrosLocales.terminoBusqueda,
    });
    if (categoria) {
      mostrarNotificacion(`Categoría seleccionada: ${categoria}`, "info");
    }
  };

  return {
    filtrosLocales,
    errores,
    categoriasUnicas,
    marcasUnicas,
    modelosUnicos,
    configuracionValidaciones,
    prevenirCaracteresInvalidos,
    manejarCambioFiltro,
    manejarAplicarFiltros,
    manejarLimpiarFiltros,
    manejarBusquedaEnTiempoReal,
    manejarCambioCategoria,
  };
}
