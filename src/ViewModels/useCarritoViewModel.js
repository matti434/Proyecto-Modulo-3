import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../Componentes/Context/ContextoCarrito";
import { CarritoItem } from "../Models";
import toast from "react-hot-toast";
import { confirmarAccion } from "../Componentes/Utils/confirmacion";
import { useUser } from "../Componentes/Context/ContextoUsuario";
import { pagosApi } from "../Services/Api";
import { pedidosApi } from "../Services/Api";

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
      vaciarCarrito();
    }
  }, [vaciarCarrito, limpiarDescuento, confirmarAccion]);

  const handleSeguirComprando = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleProcederPago = useCallback(async () => {
  if (itemsCarrito.length === 0) {
    toast.warning("El carrito está vacío");
    return;
  }

  const payload = {
    items: itemsCarrito.map((item) => ({
      productoId: item.productoOriginal?.id || item.productoOriginal?._id,
      cantidad: item.cantidad,
      precioUnitario: item.precio,
    })),
    subtotal: calcularSubtotal(),
    envio: 1500,
  };

  try {
    toast.loading("Procesando pago...", { id: "pago" });

    // Opción A: Si existe endpoint de pagos
    const resultado = await pagosApi.crearTransaccion(payload);

    if (resultado?.exito && resultado?.transaccionId) {
      toast.success("Pago procesado correctamente", { id: "pago" });
      vaciarCarrito();
      navigate("/");
    } else {
      toast.error(resultado?.mensaje || "Error al procesar el pago", { id: "pago" });
    }

    // Opción B: Si se usa pedidosApi para crear pedido desde carrito
    // const resultado = await pedidosApi.crear(payload);
    // Validar respuesta y manejar éxito/error
  } catch (err) {
    toast.error(err?.message || "Error al conectar con el servidor de pagos", { id: "pago" });
  }
}, [itemsCarrito, calcularSubtotal, vaciarCarrito, navigate]);

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
