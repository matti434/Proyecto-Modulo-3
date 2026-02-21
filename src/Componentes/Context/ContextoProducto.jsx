import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { productosApi } from "../../Services/Api";

const ContextoProducto = createContext();

export const useProductos = () => {
  const context = useContext(ContextoProducto);
  if (!context) {
    throw new Error(
      "useProductos debe ser usado dentro de un ProveedorProductos"
    );
  }
  return context;
};

/**
 * Función de filtrado extraída para ser usada en el ViewModel
 * El contexto la expone para que el ViewModel pueda usarla
 */
function normalizarCategoria(c) {
  if (!c || typeof c !== "string") return "";
  const lower = c.trim().toLowerCase();
  if (lower === "motocicletas" || lower === "motos") return "motos";
  return c.trim();
}

export const filtrarProductos = (productos, filtros) => {
  return productos.filter((producto) => {
    // Filtro por categoría
    if (filtros.categoria && producto.categoria) {
      const catFiltro = normalizarCategoria(filtro.categoria);
      const catProd = normalizarCategoria(producto.categoria);
      if (catProd !== catFiltro) return false;
    }

    // Filtro por término de búsqueda
    if (filtros.terminoBusqueda) {
      const termino = filtros.terminoBusqueda.toLowerCase();
      const coincideNombre = producto.nombre?.toLowerCase().includes(termino);
      const coincideMarca = producto.marca?.toLowerCase().includes(termino);
      const coincideModelo = producto.modelo?.toLowerCase().includes(termino);
      const coincideDescripcion = producto.descripcion?.toLowerCase().includes(termino);
      if (!(coincideNombre || coincideMarca || coincideModelo || coincideDescripcion)) {
        return false;
      }
    }

    // Filtro por precio
    const precioProducto = parseFloat(producto.precio) || 0;
    if (filtros.precioMin && precioProducto < parseFloat(filtros.precioMin)) {
      return false;
    }
    if (filtros.precioMax && precioProducto > parseFloat(filtros.precioMax)) {
      return false;
    }

    // Filtro por marca
    if (filtros.marca && producto.marca?.toLowerCase() !== filtros.marca.toLowerCase()) {
      return false;
    }

    // Filtro por modelo
    if (filtros.modelo && producto.modelo?.toLowerCase() !== filtros.modelo.toLowerCase()) {
      return false;
    }

    // Filtro por destacado
    if (filtros.destacado !== "") {
      if ((producto.destacado?.toString() || "false") !== filtros.destacado) {
        return false;
      }
    }

    // Filtro por stock
    if (filtros.stock !== "") {
      if ((producto.stock?.toString() || "true") !== filtros.stock) {
        return false;
      }
    }

    return true;
  });
};

export const ProveedorProductos = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    categoria: "",
    terminoBusqueda: "",
    precioMin: "",
    precioMax: "",
    marca: "",
    modelo: "",
    destacado: "",
    stock: "",
  });

  const cargarProductos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await productosApi.obtenerTodos();
      const lista = Array.isArray(data) ? data : data?.productos ?? data?.data ?? [];
      setProductos(lista);
    } catch (err) {
      setError(err?.message || "Error al cargar los productos. Verifica que el backend esté disponible.");
      setProductos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const actualizarFiltros = useCallback((nuevosFiltros) => {
    setFiltros((prev) => ({ ...prev, ...nuevosFiltros }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros({
      categoria: "",
      terminoBusqueda: "",
      precioMin: "",
      precioMax: "",
      marca: "",
      modelo: "",
      destacado: "",
      stock: "",
    });
  }, []);

  const filtrarPorCategoria = useCallback((categoria) => {
    setFiltros((prev) => ({ ...prev, categoria }));
  }, []);

  const obtenerCategoriasUnicas = useCallback(() => {
    const categorias = productos
      .map((p) => p.categoria)
      .filter((c) => c && c.trim() !== "");
    return [...new Set(categorias)];
  }, [productos]);

  const obtenerMarcasPorCategoria = useCallback(
    (categoria) => {
      const productosCategoria = categoria
        ? productos.filter((p) => p.categoria === categoria)
        : productos;
      const marcas = productosCategoria
        .map((p) => p.marca)
        .filter((m) => m && m.trim() !== "");
      return [...new Set(marcas)];
    },
    [productos]
  );

  const obtenerProductosPorCategoria = useCallback(
    (categoria) => {
      if (!categoria) return productos;
      return productos.filter(
        (p) => p.categoria?.toLowerCase() === categoria.toLowerCase()
      );
    },
    [productos]
  );

  const obtenerEstadisticas = useCallback(() => {
    const productosPorCategoria = {};
    const productosPorMarca = {};

    productos.forEach((p) => {
      const categoria = p.categoria || "Sin categoría";
      productosPorCategoria[categoria] =
        (productosPorCategoria[categoria] || 0) + 1;

      const marca = p.marca || "Sin marca";
      productosPorMarca[marca] = (productosPorMarca[marca] || 0) + 1;
    });

    return {
      total: productos.length,
      porCategoria: productosPorCategoria,
      porMarca: productosPorMarca,
      disponibles: productos.filter((p) => p.stock).length,
      sinStock: productos.filter((p) => !p.stock).length,
      destacados: productos.filter((p) => p.destacado).length,
      categoriasUnicas: Object.keys(productosPorCategoria).length,
      marcasUnicas: Object.keys(productosPorMarca).length,
    };
  }, [productos]);

  const obtenerRangoPrecios = useCallback(() => {
    if (!productos.length) return { min: 0, max: 0, promedio: 0 };
    const precios = productos.map((p) => parseFloat(p.precio) || 0);
    return {
      min: Math.min(...precios),
      max: Math.max(...precios),
      promedio: precios.reduce((a, b) => a + b, 0) / precios.length,
    };
  }, [productos]);

  const buscarSugerencias = useCallback(
    (termino) => {
      if (!termino || termino.length < 2) return [];
      const busqueda = termino.toLowerCase();
      return productos
        .filter(
          (p) =>
            p.nombre?.toLowerCase().includes(busqueda) ||
            p.marca?.toLowerCase().includes(busqueda) ||
            p.modelo?.toLowerCase().includes(busqueda)
        )
        .slice(0, 5);
    },
    [productos]
  );

  const agregarProducto = useCallback(async (producto) => {
    try {
      const res = await productosApi.crear(producto);
      if (res.exito && res.producto) {
        const p = res.producto;
        setProductos((prev) => [...prev, p]);
        return { exito: true, producto: p };
      }
      return { exito: false, mensaje: res.mensaje || "Error al crear producto" };
    } catch (err) {
      return { exito: false, mensaje: err?.message || "Error al crear producto" };
    }
  }, []);

  const editarProducto = useCallback(async (id, datosActualizados) => {
    try {
      const res = await productosApi.actualizar(id, datosActualizados);
      if (res.exito && res.producto) {
        const p = res.producto;
        setProductos((prev) =>
          prev.map((item) => (item.id === id || item._id === id ? p : item))
        );
        return { exito: true, producto: p };
      }
      return { exito: false, mensaje: res.mensaje || "Error al actualizar" };
    } catch (err) {
      return { exito: false, mensaje: err?.message || "Error al actualizar producto" };
    }
  }, []);

  const eliminarProducto = useCallback(async (id) => {
    try {
      const res = await productosApi.eliminar(id);
      if (res.exito) {
        setProductos((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        return { exito: true };
      }
      return { exito: false, mensaje: res.mensaje || "Error al eliminar" };
    } catch (err) {
      return { exito: false, mensaje: err?.message || "Error al eliminar producto" };
    }
  }, []);

  const obtenerProductoPorId = useCallback((id) => {
    return productos.find((p) => p.id === id || p._id === id) ?? null;
  }, [productos]);

  const obtenerProductosDestacados = useCallback(() => {
    return productos.filter((p) => p.destacado);
  }, [productos]);

  const obtenerProductosConStock = useCallback(() => {
    return productos.filter((p) => p.stock);
  }, [productos]);

  const obtenerProductosRecientes = useCallback((limite = 5) => {
    return [...productos]
      .sort((a, b) => new Date(b.fechaCreacion || b.createdAt || 0) - new Date(a.fechaCreacion || a.createdAt || 0))
      .slice(0, limite);
  }, [productos]);

  const actualizarStockProducto = useCallback(async (id, tieneStock) => {
    const product = productos.find((p) => p.id === id || p._id === id);
    if (!product) return { exito: false, mensaje: "Producto no encontrado" };
    return editarProducto(id, { ...product, stock: tieneStock });
  }, [productos, editarProducto]);

  // Productos filtrados para compatibilidad con componentes existentes
  // La lógica de filtrado también está disponible en useProductosViewModel
  const productosFiltrados = filtrarProductos(productos, filtros);

  const valorContexto = {
    // Datos crudos
    productos,
    productosFiltrados, // Para compatibilidad con componentes existentes
    cargando,
    error,
    filtros,

    // Acciones de filtros
    actualizarFiltros,
    limpiarFiltros,
    filtrarPorCategoria,

    // Funciones de consulta
    obtenerCategoriasUnicas,
    obtenerMarcasPorCategoria,
    obtenerProductosPorCategoria,
    obtenerEstadisticas,
    obtenerRangoPrecios,
    buscarSugerencias,
    obtenerProductoPorId,
    obtenerProductosDestacados,
    obtenerProductosConStock,
    obtenerProductosRecientes,

    // Acciones CRUD
    cargarProductos,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    actualizarStockProducto,
  };

  return (
    <ContextoProducto.Provider value={valorContexto}>
      {children}
    </ContextoProducto.Provider>
  );
};
