import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { carritoApi } from "../../Services/Api";
import { useUser } from "./ContextoUsuario";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider");
  }
  return context;
};

const normalizarItemBackend = (item) => {
  const prod = item.producto || {};
  const nombre =
    prod.nombre || [prod.marca, prod.modelo].filter(Boolean).join(" ").trim() || "Producto";

  const pid = prod._id || prod.id;
  return {
    id: item._id || item.id,
    nombre,
    precio: item.precioUnitario ?? prod.precio ?? 0,
    cantidad: item.cantidad ?? 1,
    imagen: prod.imagen || "",
    productoOriginal: { ...prod, _id: pid, id: pid },
    marca: prod.marca || "",
    modelo: prod.modelo || "",
  };
};

export const CarritoProvider = ({ children }) => {
  const { estaAutenticado, esAdministrador, cargando } = useUser();
  const [itemsCarrito, setItemsCarrito] = useState([]);

  const cargarCarritoDesdeApi = useCallback(async () => {
    try {
      const data = await carritoApi.obtener();
      const items = (data.items || []).map(normalizarItemBackend);
      setItemsCarrito(items);
    } catch {
      setItemsCarrito([]);
    }
  }, []);

  const cargarDesdeLocalStorage = useCallback(() => {
    try {
      const guardado = localStorage.getItem("carritoMotos");
      if (guardado) setItemsCarrito(JSON.parse(guardado));
    } catch {
      localStorage.removeItem("carritoMotos");
    }
  }, []);

  useEffect(() => {
    if (cargando) return;

    if (estaAutenticado) {
      cargarCarritoDesdeApi();
    } else {
      cargarDesdeLocalStorage();
    }
  }, [cargando, estaAutenticado, cargarCarritoDesdeApi, cargarDesdeLocalStorage]);

  useEffect(() => {
    if (!estaAutenticado) {
      localStorage.setItem("carritoMotos", JSON.stringify(itemsCarrito));
    }
  }, [itemsCarrito, estaAutenticado]);

  const agregarAlCarrito = useCallback(
    async (producto, cantidad = 1) => {
      if (!estaAutenticado || esAdministrador) return;

      const rawPid = producto?._id ?? producto?.id;
      const productoId =
        rawPid != null && rawPid !== "" ? String(rawPid).trim() : "";
      const cant = Math.max(1, parseInt(cantidad, 10) || 1);

      if (!productoId) {
        toast.error(
          "No se pudo identificar el producto. Vuelve a la lista e inténtalo de nuevo."
        );
        return;
      }

      try {
        await carritoApi.agregarItem(productoId, cant);
        await cargarCarritoDesdeApi();
      } catch (e) {
        toast.error(e?.message || "No se pudo agregar al carrito");
        try {
          await cargarCarritoDesdeApi();
        } catch {
          /* ignorar */
        }
      }
    },
    [estaAutenticado, esAdministrador, cargarCarritoDesdeApi]
  );

  const quitarDelCarrito = useCallback((id) => {
    setItemsCarrito((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const eliminarDelCarrito = useCallback(async (itemId) => {
    if (estaAutenticado && !esAdministrador) {
      try {
        await carritoApi.eliminarItem(itemId);
        await cargarCarritoDesdeApi();
      } catch {
        setItemsCarrito((prev) => prev.filter((item) => item.id !== itemId));
      }
    } else {
      setItemsCarrito((prev) => prev.filter((item) => item.id !== itemId));
    }
  }, [estaAutenticado, esAdministrador, cargarCarritoDesdeApi]);

  const actualizarCantidad = useCallback(async (itemId, cantidad) => {
    const cant = Math.max(1, parseInt(cantidad, 10) || 1);
    if (estaAutenticado && !esAdministrador) {
      try {
        await carritoApi.actualizarCantidad(itemId, cant);
        await cargarCarritoDesdeApi();
      } catch {
        setItemsCarrito((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, cantidad: cant } : item
          )
        );
      }
    } else {
      setItemsCarrito((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, cantidad: cant } : item
        )
      );
    }
  }, [estaAutenticado, esAdministrador, cargarCarritoDesdeApi]);

  const calcularSubtotal = useCallback(() => {
    return itemsCarrito.reduce(
      (total, item) => total + (parseFloat(item.precio) || 0) * (item.cantidad || 1),
      0
    );
  }, [itemsCarrito]);

  const calcularTotalProductos = useCallback(() => {
    return itemsCarrito.reduce((total, item) => total + (item.cantidad || 1), 0);
  }, [itemsCarrito]);

  const vaciarCarrito = useCallback(async () => {
    if (estaAutenticado && !esAdministrador) {
      try {
        await carritoApi.vaciar();
      } catch {
        /* seguimos vaciando UI */
      }
    }
    setItemsCarrito([]);
    if (!estaAutenticado) {
      localStorage.removeItem("carritoMotos");
    }
  }, [estaAutenticado, esAdministrador]);

  const valorTotal = itemsCarrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        itemsCarrito,
        agregarAlCarrito,
        quitarDelCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        valorTotal,
        calcularSubtotal,
        calcularTotalProductos,
        cargarCarritoInvitado: cargarDesdeLocalStorage,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
