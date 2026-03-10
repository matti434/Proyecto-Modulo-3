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
  const { estaAutenticado, esAdministrador } = useUser();
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

      // 🚫 Bloquear invitados
      if (!estaAutenticado) {
        return;
      }

      // 🚫 Bloquear administradores
      if (esAdministrador) {
        return;
      }

      const productoId = producto.id || producto._id;

      const productoConId = {
        ...producto,
        id:
          productoId ||
          `producto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      };

      if (estaAutenticado && productoId) {
        try {
          await carritoApi.agregarItem(productoId, cantidad);
          await cargarCarritoDesdeApi();
          return;
        } catch {
          setItemsCarrito((prev) => {
            const idx = prev.findIndex(
              (i) =>
                (i.productoOriginal?.id || i.productoOriginal?._id) ===
                productoId
            );

            if (idx !== -1) {
              const next = [...prev];
              next[idx] = {
                ...next[idx],
                cantidad: next[idx].cantidad + cantidad,
              };
              return next;
            }

            return [
              ...prev,
              {
                id: `local-${Date.now()}`,
                nombre:
                  `${productoConId.marca || ""} ${
                    productoConId.modelo || ""
                  }`.trim() || "Producto",
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
    },
    [estaAutenticado, esAdministrador, cargarCarritoDesdeApi]
  );

  const quitarDelCarrito = useCallback((id) => {
    setItemsCarrito((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => {
    setItemsCarrito([]);
  }, []);

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
        vaciarCarrito,
        valorTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};