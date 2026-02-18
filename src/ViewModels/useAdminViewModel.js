import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "../Componentes/Context/ContextoUsuario";
import { useProductos } from "../Componentes/Context/ContextoProducto";
import { pedidosApi } from "../Services/Api";
import toast from "react-hot-toast";
import { confirmarAccion } from "../Componentes/Utils/confirmacion";
import { productoSchema, LIMITES } from "../Componentes/Utils/ValidacionesForm";

/** Convierte errores de Zod a { campo: mensaje } para los formularios. */
function erroresZodAObjeto(errorZod) {
  const flat =
    typeof errorZod.flatten === "function"
      ? errorZod.flatten()
      : { fieldErrors: {} };
  const fieldErrors = flat.fieldErrors || {};
  const resultado = {};
  for (const [campo, mensajes] of Object.entries(fieldErrors)) {
    const msg = Array.isArray(mensajes) ? mensajes[0] : mensajes;
    if (msg) resultado[campo] = msg;
  }
  return resultado;
}

/**
 * ViewModel para AdminPanel
 * Contiene toda la lógica de negocio y estado
 */
export const useAdminViewModel = () => {
  // ========== CONTEXT ==========
  const {
    usuarios,
    usuariosSuspendidos,
    esAdministrador,
    suspenderUsuario,
    reactivarUsuario,
    eliminarUsuarioSuspendido,
    editarUsuario,
    sincronizarConAPI,
  } = useUser();

  const {
    productos,
    cargando,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    cargarProductos,
    obtenerEstadisticas,
  } = useProductos();

  // ========== ESTADO LOCAL ==========
  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [modoFormularioProducto, setModoFormularioProducto] = useState("agregar");

  // Estado para recomendaciones
  const [recomendaciones, setRecomendaciones] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  // Estado para pedidos (desde API)
  const [pedidos, setPedidos] = useState([]);
  const [pedidosCargando, setPedidosCargando] = useState(false);
  const [pedidoActual, setPedidoActual] = useState({ id: null, titulo: "", descripcion: "" });
  const [modoPedido, setModoPedido] = useState("agregar");

  // Estado para formulario de producto
  const [datosFormularioProducto, setDatosFormularioProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    categoria: "",
    marca: "",
    modelo: "",
    año: "",
    kilometros: "",
    ubicacion: "",
    imagen: "",
    destacado: false,
    stock: true,
  });
  const [errorImagenProducto, setErrorImagenProducto] = useState(false);
  const [enviandoFormularioProducto, setEnviandoFormularioProducto] = useState(false);
  const [erroresFormularioProducto, setErroresFormularioProducto] = useState({});
  const [erroresPedido, setErroresPedido] = useState({});

  // ========== EFECTOS ==========
  useEffect(() => {
    if (vistaActiva === "productos") {
      cargarProductos();
    }
  }, [vistaActiva, cargarProductos]);

  useEffect(() => {
    if (vistaActiva === "pedidos" && esAdministrador) {
      const cargarPedidos = async () => {
        setPedidosCargando(true);
        try {
          const data = await pedidosApi.obtenerTodos();
          setPedidos(Array.isArray(data) ? data : []);
        } catch {
          toast.error("Error al cargar pedidos");
          setPedidos([]);
        } finally {
          setPedidosCargando(false);
        }
      };
      cargarPedidos();
    }
  }, [vistaActiva, esAdministrador]);

  // Inicializar formulario al editar producto (trunca con LIMITES de ValidacionesForm)
  useEffect(() => {
    const limites = LIMITES.producto;
    if (modoFormularioProducto === "editar" && productoEditando) {
      const s = (val, max) => (val || "").slice(0, max);
      setDatosFormularioProducto({
        nombre: s(productoEditando.nombre, limites.nombre),
        precio: productoEditando.precio ?? "",
        descripcion: s(productoEditando.descripcion, limites.descripcion),
        categoria: productoEditando.categoria || "",
        marca: s(productoEditando.marca, limites.marca),
        modelo: s(productoEditando.modelo, limites.modelo),
        año: s(productoEditando.año, limites.año),
        kilometros: s(productoEditando.kilometros, limites.kilometros),
        ubicacion: s(productoEditando.ubicacion, limites.ubicacion),
        imagen: s(productoEditando.imagen, limites.imagen),
        destacado: productoEditando.destacado || false,
        stock:
          productoEditando.stock !== undefined ? productoEditando.stock : true,
      });
    } else {
      setDatosFormularioProducto({
        nombre: "",
        precio: "",
        descripcion: "",
        categoria: "",
        marca: "",
        modelo: "",
        año: "",
        kilometros: "",
        ubicacion: "",
        imagen: "",
        destacado: false,
        stock: true,
      });
    }
    setErrorImagenProducto(false);
    setErroresFormularioProducto({});
  }, [productoEditando, modoFormularioProducto]);

  // ========== CÁLCULOS (useMemo) ==========
  const estadisticas = useMemo(
    () => obtenerEstadisticas(),
    [obtenerEstadisticas, productos],
  );

  const totalAdmins = useMemo(
    () => usuarios.filter((u) => u.role === "admin").length,
    [usuarios],
  );

  const totalNormales = useMemo(
    () => usuarios.filter((u) => u.role === "user").length,
    [usuarios],
  );

  const totalUsuarios = useMemo(() => usuarios.length, [usuarios]);

  const totalSuspendidos = useMemo(
    () => usuariosSuspendidos.length,
    [usuariosSuspendidos],
  );

  const suspendidosMas30Dias = useMemo(() => {
    return usuariosSuspendidos.filter((u) => {
      const fechaSuspension = new Date(u.fechaSuspension);
      const hoy = new Date();
      const diffDias = Math.floor(
        (hoy - fechaSuspension) / (1000 * 60 * 60 * 24),
      );
      return diffDias > 30;
    }).length;
  }, [usuariosSuspendidos]);

  const valorTotalProductos = useMemo(() => {
    return productos
      .reduce((total, p) => total + (parseFloat(p.precio) || 0), 0)
      .toFixed(2);
  }, [productos]);

  // ========== FUNCIONES (useCallback) ==========
  const manejarSincronizacion = useCallback(async () => {
    const resultado = await sincronizarConAPI();
    toast.success(resultado.mensaje);
  }, [sincronizarConAPI]);

  const manejarEditarProducto = useCallback((producto) => {
    setProductoEditando(producto);
    setModoFormularioProducto("editar");
    setMostrarFormProducto(true);
  }, []);

  const manejarEliminarProducto = useCallback(
    async (id) => {
      const confirmado = await confirmarAccion(
        "¿Estás seguro de eliminar este producto?",
        "Esta acción no se puede deshacer.",
      );
      if (confirmado) {
        const resultado = await eliminarProducto(id);
        if (resultado.exito) {
          toast.success("Producto eliminado correctamente");
        } else {
          toast.error("Error: " + resultado.mensaje);
        }
      }
    },
    [eliminarProducto],
  );

  const manejarAbrirFormularioProducto = useCallback(() => {
    setModoFormularioProducto("agregar");
    setProductoEditando(null);
    setMostrarFormProducto(true);
    setDatosFormularioProducto({
      nombre: "",
      precio: "",
      descripcion: "",
      categoria: "",
      marca: "",
      modelo: "",
      año: "",
      kilometros: "",
      ubicacion: "",
      imagen: "",
      destacado: false,
      stock: true,
    });
    setErrorImagenProducto(false);
    setErroresFormularioProducto({});
  }, []);

  const manejarCerrarFormularioProducto = useCallback(() => {
    setMostrarFormProducto(false);
    setProductoEditando(null);
    setModoFormularioProducto("agregar");
    setDatosFormularioProducto({
      nombre: "",
      precio: "",
      descripcion: "",
      categoria: "",
      marca: "",
      modelo: "",
      año: "",
      kilometros: "",
      ubicacion: "",
      imagen: "",
      destacado: false,
      stock: true,
    });
    setErrorImagenProducto(false);
    setErroresFormularioProducto({});
  }, []);

  const manejarGuardarProducto = useCallback(
    async (e) => {
      e.preventDefault();
      const datos = { ...datosFormularioProducto };
      if (datos.precio === "") datos.precio = "";
      const resultado = productoSchema.safeParse(datos);
      if (!resultado.success) {
        setErroresFormularioProducto(erroresZodAObjeto(resultado.error));
        return;
      }
      setErroresFormularioProducto({});
      setEnviandoFormularioProducto(true);
      try {
        const payload = {
          ...datosFormularioProducto,
          precio:
            typeof resultado.data.precio === "number"
              ? String(resultado.data.precio)
              : datosFormularioProducto.precio,
        };
        if (modoFormularioProducto === "editar" && productoEditando) {
          const res = await editarProducto(productoEditando.id, payload);
          if (res.exito) {
            toast.success("Producto actualizado correctamente");
            manejarCerrarFormularioProducto();
          } else {
            toast.error("Error: " + res.mensaje);
          }
        } else {
          const res = await agregarProducto(payload);
          if (res.exito) {
            toast.success("Producto agregado correctamente");
            manejarCerrarFormularioProducto();
          } else {
            toast.error("Error: " + res.mensaje);
          }
        }
      } catch (error) {
        toast.error("Error inesperado: " + error.message);
      } finally {
        setEnviandoFormularioProducto(false);
      }
    },
    [
      modoFormularioProducto,
      productoEditando,
      datosFormularioProducto,
      editarProducto,
      agregarProducto,
      manejarCerrarFormularioProducto,
    ],
  );

  const manejarCambioCampoFormulario = useCallback((campo, valor) => {
    setDatosFormularioProducto((prev) => ({ ...prev, [campo]: valor }));
    setErroresFormularioProducto((prev) => {
      const next = { ...prev };
      delete next[campo];
      return next;
    });
  }, []);

  const manejarErrorImagen = useCallback((error) => {
    setErrorImagenProducto(error);
  }, []);

  const manejarEditarUsuario = useCallback((usuario) => {
    setUsuarioEditando(usuario);
  }, []);

  const manejarGuardarUsuario = useCallback(
    (datosUsuario) => {
      if (usuarioEditando) {
        editarUsuario(usuarioEditando.id, datosUsuario);
        setUsuarioEditando(null);
      }
    },
    [usuarioEditando, editarUsuario],
  );

  const manejarCancelarEdicionUsuario = useCallback(() => {
    setUsuarioEditando(null);
  }, []);

  // Funciones de recomendaciones
  const manejarAgregarRecomendacion = useCallback(() => {
    if (!nuevoComentario.trim()) return;
    if (modoEdicion && notaEditando) {
      setRecomendaciones((prev) =>
        prev.map((nota) =>
          nota.id === notaEditando.id
            ? { ...nota, texto: nuevoComentario }
            : nota,
        ),
      );
      setModoEdicion(false);
      setNotaEditando(null);
    } else {
      setRecomendaciones((prev) => [
        ...prev,
        { id: Date.now(), texto: nuevoComentario },
      ]);
    }
    setNuevoComentario("");
  }, [nuevoComentario, modoEdicion, notaEditando]);

  const manejarEditarRecomendacion = useCallback((recomendacion) => {
    setModoEdicion(true);
    setNotaEditando(recomendacion);
    setNuevoComentario(recomendacion.texto);
  }, []);

  const manejarEliminarRecomendacion = useCallback((id) => {
    setRecomendaciones((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const manejarCancelarEdicionRecomendacion = useCallback(() => {
    setModoEdicion(false);
    setNotaEditando(null);
    setNuevoComentario("");
  }, []);

  const manejarActualizarEstadoPedido = useCallback(async (pedidoId, estado) => {
    try {
      await pedidosApi.actualizarEstado(pedidoId, estado);
      setPedidos((prev) =>
        prev.map((p) => (p._id === pedidoId || p.id === pedidoId ? { ...p, estado } : p))
      );
      toast.success("Estado actualizado");
    } catch (err) {
      toast.error(err?.message || "Error al actualizar estado");
    }
  }, []);

  const manejarGuardarPedido = useCallback(() => {
    toast.info("Los pedidos se crean desde el carrito en el checkout.");
  }, []);

  const manejarPedidoCampoChange = useCallback((campo, valor) => {
    setPedidoActual((prev) => ({ ...prev, [campo]: valor }));
    setErroresPedido((prev) => ({ ...prev, [campo]: undefined }));
  }, []);

  const manejarEditarPedido = useCallback((pedido) => {
    setPedidoActual({
      id: pedido._id || pedido.id,
      titulo: pedido.usuario?.nombreDeUsuario || pedido.usuario?.email || "",
      descripcion: (pedido.estado || "").slice(0, 200),
    });
    setModoPedido("editar");
    setErroresPedido({});
  }, []);

  const manejarEliminarPedido = useCallback(() => {
    toast.info("Eliminar pedidos no está disponible desde el panel.");
  }, []);

  // ========== RETORNO ==========
  return {
    usuarios,
    usuariosSuspendidos,
    productos,
    esAdministrador,
    cargando,
    estadisticas,

    vistaActiva,
    usuarioEditando,
    productoEditando,
    mostrarFormProducto,
    modoFormularioProducto,
    pedidos,
    pedidosCargando,
    pedidoActual,
    modoPedido,

    datosFormularioProducto,
    errorImagenProducto,
    enviandoFormularioProducto,
    erroresFormularioProducto,
    erroresPedido,

    recomendaciones,
    nuevoComentario,
    modoEdicion,
    notaEditando,

    totalAdmins,
    totalNormales,
    totalUsuarios,
    totalSuspendidos,
    suspendidosMas30Dias,
    valorTotalProductos,

    onCambiarVista: setVistaActiva,
    onSincronizar: manejarSincronizacion,

    onEditarUsuario: manejarEditarUsuario,
    onSuspenderUsuario: suspenderUsuario,
    onReactivarUsuario: reactivarUsuario,
    onEliminarUsuarioSuspendido: eliminarUsuarioSuspendido,
    onGuardarUsuario: manejarGuardarUsuario,
    onCancelarEdicionUsuario: manejarCancelarEdicionUsuario,

    onAbrirFormularioProducto: manejarAbrirFormularioProducto,
    onEditarProducto: manejarEditarProducto,
    onEliminarProducto: manejarEliminarProducto,
    onGuardarProducto: manejarGuardarProducto,
    onCancelarFormularioProducto: manejarCerrarFormularioProducto,
    onCambioCampoFormulario: manejarCambioCampoFormulario,
    onErrorImagen: manejarErrorImagen,

    onNuevoComentarioChange: setNuevoComentario,
    onAgregarRecomendacion: manejarAgregarRecomendacion,
    onEditarRecomendacion: manejarEditarRecomendacion,
    onEliminarRecomendacion: manejarEliminarRecomendacion,
    onCancelarEdicionRecomendacion: manejarCancelarEdicionRecomendacion,

    onPedidoActualChange: setPedidoActual,
    onPedidoCampoChange: manejarPedidoCampoChange,
    onGuardarPedido: manejarGuardarPedido,
    onEditarPedido: manejarEditarPedido,
    onEliminarPedido: manejarEliminarPedido,
    onActualizarEstadoPedido: manejarActualizarEstadoPedido,
  };
};
