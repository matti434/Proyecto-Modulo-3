import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro de un CarritoProvider");
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  const [itemsCarrito, setItemsCarrito] = useState([]);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carritoMotos");
    if (carritoGuardado) {
      try {
        const carritoParseado = JSON.parse(carritoGuardado);

        setItemsCarrito(carritoParseado);
      } catch {
        localStorage.removeItem("carritoMotos");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carritoMotos", JSON.stringify(itemsCarrito));
  }, [itemsCarrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const productoConId = {
      ...producto,
      id:
        producto.id ||
        `producto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setItemsCarrito((prevItems) => {
      const productoExistenteIndex = prevItems.findIndex(
        (item) => item.id === productoConId.id
      );

      if (productoExistenteIndex !== -1) {
        const nuevosItems = [...prevItems];
        nuevosItems[productoExistenteIndex] = {
          ...nuevosItems[productoExistenteIndex],
          cantidad: nuevosItems[productoExistenteIndex].cantidad + cantidad,
        };
        return nuevosItems;
      } else {
        const nuevoItem = {
          id: productoConId.id,
          nombre: `${productoConId.marca} ${productoConId.modelo}`,
          precio: parseFloat(productoConId.precio) || 0,
          cantidad: cantidad,
          imagen: productoConId.imagen,
          productoOriginal: productoConId,
          descuento: 0,
          marca: productoConId.marca,
          modelo: productoConId.modelo,
        };

        const nuevosItems = [...prevItems, nuevoItem];

        return nuevosItems;
      }
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setItemsCarrito((prevItems) =>
      prevItems.filter((item) => item.id !== productoId)
    );
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      eliminarDelCarrito(productoId);
      return;
    }

    setItemsCarrito((prevItems) =>
      prevItems.map((item) =>
        item.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItemsCarrito([]);
  };

  const calcularSubtotal = () => {
    const subtotal = itemsCarrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
    return subtotal;
  };

  const calcularTotalProductos = () => {
    const total = itemsCarrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
    return total;
  };

  const estaEnCarrito = (productoId) => {
    return itemsCarrito.some((item) => item.id === productoId);
  };

  const obtenerCantidadProducto = (productoId) => {
    const item = itemsCarrito.find((item) => item.id === productoId);
    return item ? item.cantidad : 0;
  };

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
