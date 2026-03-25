import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Componentes/Context/ContextoCarrito";
import { CarritoItem } from "../Models";
import toast from "react-hot-toast";
import { confirmarAccion } from "../Componentes/Utils/confirmacion";
import { useUser } from "../Componentes/Context/ContextoUsuario";
import { pagosApi } from "../Services/Api";

export const useCarritoViewModel = () => {
  const navigate = useNavigate();
  const { estaAutenticado } = useUser();
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
  const [procesandoPago, setProcesandoPago] = useState(false);

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
    const codigo = codigoDescuento.trim(); 
    if (!codigo) {
      return { exito: false, mensaje: "Ingresa un codigo de descuento" };
    } 
    if (codigo.length !== 5) {
      return { exito: false, mensaje: "El codigo debe tener 5 letras" };
    }

    if (!/^[A-Za-z]+$/.test(codigo)) {
      return { exito: false, mensaje: "Solo se permiten letras" };
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
      await vaciarCarrito();
    }
  }, [vaciarCarrito, limpiarDescuento]);

  const handleSeguirComprando = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleProcederPago = useCallback(async () => {
    if (itemsCarrito.length === 0) {
      toast.warning("El carrito está vacío");
      return;
    }

    if (!estaAutenticado) {
      toast.error("Debes iniciar sesión para proceder al pago");
      navigate("/login?redirect=/carrito");
      return;
    }

    setProcesandoPago(true);

    const payload = {
      items: itemsCarrito.map((item) => ({
        productoId: item.productoOriginal?._id || item.productoOriginal?.id || item.productoId || item.id,
        nombre: item.nombre || `${item.marca || ""} ${item.modelo || ""}`.trim() || "Producto",
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      })),
      subtotal: calcularSubtotal(),
      envio: itemsCarrito.length > 0 ? 1500 : 0,
    };

    try {
      const resultado = await pagosApi.crearPreferencia(payload);
      const initPoint = resultado?.initPoint || resultado?.init_point;

      if (resultado?.exito && initPoint) {
        window.location.href = initPoint;
      } else {
        toast.error(resultado?.mensaje || "Error al crear el pago");
      }
    } catch (err) {
      toast.error(err?.message || "Error al conectar con el servidor de pagos");
    } finally {
      setProcesandoPago(false);
    }
  }, [itemsCarrito, calcularSubtotal, estaAutenticado, navigate]);

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
    procesandoPago,
  };
};
