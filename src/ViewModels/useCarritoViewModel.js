import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Componentes/Context/ContextoCarrito";
import { CarritoItem } from "../Models";
import toast from "react-hot-toast";
import { confirmarAccion } from "../Componentes/Utils/confirmacion";

export const useCarritoViewModel = () => {
  const navigate = useNavigate();
  const {
    itemsCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularSubtotal,
    calcularTotalProductos,
  } = useCarrito();

  const [codigoDescuento, setCodigoDescuento] = useState("");
  const [descuentoAplicado, setDescuentoAplicado] = useState(null);

  const items = useMemo(() => {
    return itemsCarrito.map((item) => CarritoItem.fromJSON(item));
  }, [itemsCarrito]);

  const subtotal = useMemo(
    () => calcularSubtotal(),
    [calcularSubtotal, itemsCarrito],
  );

  const envio = useMemo(
    () => (itemsCarrito.length > 0 ? 1500 : 0),
    [itemsCarrito.length],
  );

  const descuento = useMemo(() => {
    if (!descuentoAplicado) return 0;
    return subtotal * (descuentoAplicado / 100);
  }, [subtotal, descuentoAplicado]);

  const total = useMemo(() => {
    return subtotal + envio - descuento;
  }, [subtotal, envio, descuento]);

  const totalConDescuento = useMemo(() => {
    if (!descuentoAplicado) return null;
    return total;
  }, [total, descuentoAplicado]);

  const totalItems = useMemo(
    () => calcularTotalProductos(),
    [calcularTotalProductos, itemsCarrito],
  );

  const estaVacio = useMemo(
    () => itemsCarrito.length === 0,
    [itemsCarrito.length],
  );

  const aplicarCodigoDescuento = useCallback(() => {
    if (!codigoDescuento.trim()) {
      return { exito: false, mensaje: "Ingresa un código de descuento" };
    }

    const porcentajes = [10, 20, 30, 40, 50];
    const porcentaje =
      porcentajes[Math.floor(Math.random() * porcentajes.length)];
    setDescuentoAplicado(porcentaje);

    return { exito: true, porcentaje };
  }, [codigoDescuento]);

  const limpiarDescuento = useCallback(() => {
    setCodigoDescuento("");
    setDescuentoAplicado(null);
  }, []);

  const handleCantidadChange = useCallback(
    (productoId, nuevaCantidad) => {
      actualizarCantidad(productoId, parseInt(nuevaCantidad) || 1);
    },
    [actualizarCantidad],
  );

  const handleVaciarCarrito = useCallback(async () => {
    const confirmado = await confirmarAccion(
      "¿Estas seguro?",
      "¿Quieres vaciar todos los productos del carrito?",
    );
    if (confirmado) {
      limpiarDescuento();
      vaciarCarrito();
    }
  }, [vaciarCarrito, limpiarDescuento, confirmarAccion]);

  const handleSeguirComprando = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleProcederPago = useCallback(() => {
    if (itemsCarrito.length === 0) {
      toast.warning("El carrito está vacío");
      return;
    }
    toast("Redirigiendo al proceso de pago...");
  }, [itemsCarrito.length]);

  return {
    items,
    codigoDescuento,
    descuentoAplicado,
    subtotal,
    envio,
    descuento,
    total,
    totalConDescuento,
    totalItems,
    estaVacio,
    setCodigoDescuento,
    aplicarCodigoDescuento,
    limpiarDescuento,
    eliminarDelCarrito,
    handleCantidadChange,
    handleVaciarCarrito,
    handleSeguirComprando,
    handleProcederPago,
  };
};
