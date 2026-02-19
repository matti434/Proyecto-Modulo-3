import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

/** Normaliza un ítem del carrito del backend al formato que usa la UI */
const normalizarItemBackend = (item) => {
  const prod = item.producto || {};
  const nombre =
    prod.nombre || [prod.marca, prod.modelo].filter(Boolean).join(" ").trim() || "Producto";
  return {
    id: item._id || item.id,
    nombre,
    precio: item.precioUnitario ?? prod.precio ?? 0,
    cantidad: item.cantidad ?? 1,
    imagen: prod.imagen || "",
    productoOriginal: { ...prod, id: prod._id || prod.id },
    marca: prod.marca || "",
    modelo: prod.modelo || "",
  };
};

export const CarritoProvider = ({ children }) => {
  const { estaAutenticado } = useUser();
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
    if (estaAutenticado) {
      cargarCarritoDesdeApi();
    } else {
      cargarDesdeLocalStorage();
    }
  }, [estaAutenticado, cargarCarritoDesdeApi, cargarDesdeLocalStorage]);

  useEffect(() => {
    if (!estaAutenticado) {
      localStorage.setItem("carritoMotos", JSON.stringify(itemsCarrito));
    }
  }, [itemsCarrito, estaAutenticado]);

  const agregarAlCarrito = useCallback(
    async (producto, cantidad = 1) => {
      const productoId = producto.id || producto._id;
      const productoConId = {
        ...producto,
        id: productoId || `producto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };

      if (estaAutenticado && productoId) {
        try {
          await carritoApi.agregarItem(productoId, cantidad);
          await cargarCarritoDesdeApi();
          return;
        } catch {
          setItemsCarrito((prev) => {
            const idx = prev.findIndex((i) => (i.productoOriginal?.id || i.productoOriginal?._id) === productoId);
            if (idx !== -1) {
              const next = [...prev];
              next[idx] = { ...next[idx], cantidad: next[idx].cantidad + cantidad };
              return next;
            }
            return [
              ...prev,
              {
                id: `local-${Date.now()}`,
                nombre: `${productoConId.marca || ""} ${productoConId.modelo || ""}`.trim() || "Producto",
                precio: parseFloat(productoConId.precio) || 0,
                cantidad,
                imagen: productoConId.imagen || "",
                productoOriginal: productoConId,
                marca: productoConId.marca || "",
                modelo: productoConId.modelo || "",
              },
            ];
          });
          return;
        }
      }

      setItemsCarrito((prev) => {
        const productoExistenteIndex = prev.findIndex(
          (item) => (item.productoOriginal?.id || item.productoOriginal?._id || item.id) === productoConId.id
        );
        if (productoExistenteIndex !== -1) {
          const next = [...prev];
          next[productoExistenteIndex] = {
            ...next[productoExistenteIndex],
            cantidad: next[productoExistenteIndex].cantidad + cantidad,
          };
          return next;
        }
        return [
          ...prev,
          {
            id: productoConId.id,
            nombre: `${productoConId.marca || ""} ${productoConId.modelo || ""}`.trim() || "Producto",
            precio: parseFloat(productoConId.precio) || 0,
            cantidad,
            imagen: productoConId.imagen || "",
            productoOriginal: productoConId,
            marca: productoConId.marca || "",
            modelo: productoConId.modelo || "",
          },
        ];
      });
    },
    [estaAutenticado, cargarCarritoDesdeApi]
  );

  const eliminarDelCarrito = useCallback(
    async (itemId) => {
      if (estaAutenticado && itemId && !String(itemId).startsWith("local-")) {
        try {
          await carritoApi.eliminarItem(itemId);
        } catch {
          /* Backend puede no tener DELETE; se actualiza solo local */
        }
      }
      setItemsCarrito((prev) => prev.filter((item) => item.id !== itemId));
    },
    [estaAutenticado]
  );

  const actualizarCantidad = useCallback(
    async (itemId, nuevaCantidad) => {
      if (nuevaCantidad < 1) {
        eliminarDelCarrito(itemId);
        return;
      }
      if (estaAutenticado && itemId && !String(itemId).startsWith("local-")) {
        try {
          await carritoApi.actualizarCantidad(itemId, nuevaCantidad);
          await cargarCarritoDesdeApi();
          return;
        } catch {
          /* fallback local */
        }
      }
      setItemsCarrito((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, cantidad: nuevaCantidad } : item))
      );
    },
    [estaAutenticado, eliminarDelCarrito, cargarCarritoDesdeApi]
  );

  const vaciarCarrito = useCallback(async () => {
    if (estaAutenticado) {
      try {
        await carritoApi.vaciar();
      } catch {
        /* Backend puede no tener DELETE; se actualiza solo local */
      }
    }
    setItemsCarrito([]);
  }, [estaAutenticado]);

  const calcularSubtotal = useCallback(() => {
    return itemsCarrito.reduce((total, item) => total + (item.precio || 0) * (item.cantidad || 0), 0);
  }, [itemsCarrito]);

  const calcularTotalProductos = useCallback(() => {
    return itemsCarrito.reduce((total, item) => total + (item.cantidad || 0), 0);
  }, [itemsCarrito]);

  const estaEnCarrito = useCallback(
    (productoId) => {
      return itemsCarrito.some(
        (item) => (item.productoOriginal?.id || item.productoOriginal?._id) === productoId
      );
    },
    [itemsCarrito]
  );

  const obtenerCantidadProducto = useCallback(
    (productoId) => {
      const item = itemsCarrito.find(
        (i) => (i.productoOriginal?.id || i.productoOriginal?._id) === productoId
      );
      return item ? item.cantidad : 0;
    },
    [itemsCarrito]
  );

  const valorContexto = {
    itemsCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularSubtotal,
    calcularTotalProductos,
    estaEnCarrito,
    obtenerCantidadProducto,
  };

  return (
    <CarritoContext.Provider value={valorContexto}>
      {children}
    </CarritoContext.Provider>
  );
};
