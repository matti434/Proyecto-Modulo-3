import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "../Componentes/Context/ContextoUsuario";
import { useProductos } from "../Componentes/Context/ContextoProducto";
import { pedidosApi } from "../Services/Api";
import { homeApi } from "../Services/Api/homeApi";
import toast from "react-hot-toast";
import { confirmarAccion } from "../Componentes/Utils/confirmacion";
import { pedidoSchema, PEDIDO_FECHA_MIN, PEDIDO_FECHA_MAX } from "../Componentes/Utils/ValidacionesForm";
import { useAdminProductoForm } from "./useAdminProductoForm";

export const useAdminViewModel = () => {
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
    eliminarProducto,
    cargarProductos,
    obtenerEstadisticas,
  } = useProductos();

  const [vistaActiva, setVistaActiva] = useState("usuarios");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormProducto, setMostrarFormProducto] = useState(false);
  const [modoFormularioProducto, setModoFormularioProducto] = useState("agregar");

  const [recomendaciones, setRecomendaciones] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [notaEditando, setNotaEditando] = useState(null);

  const [pedidos, setPedidos] = useState([]);
  const [pedidosCargando, setPedidosCargando] = useState(false);
  const [pedidoActual, setPedidoActual] = useState({ id: null, titulo: "", descripcion: "", fecha: "" });
  const [mostrarFormPedido, setMostrarFormPedido] = useState(false);
  const [enviandoPedido, setEnviandoPedido] = useState(false);
  const [modoPedido, setModoPedido] = useState("agregar");
  const [erroresPedido, setErroresPedido] = useState({});

  const [contenidoHome, setContenidoHome] = useState({
    galeria: [],
    portada: { imagenUrl: "" },
  });
  const [contenidoHomeCargando, setContenidoHomeCargando] = useState(false);
  const [contenidoHomeError, setContenidoHomeError] = useState("");
  const [portadaSubiendo, setPortadaSubiendo] = useState(false);
  const [galeriaSubiendo, setGaleriaSubiendo] = useState(false);
  const [galeriaActualizandoId, setGaleriaActualizandoId] = useState(null);

  const cerrarFormularioProducto = useCallback(() => {
    setMostrarFormProducto(false);
    setProductoEditando(null);
    setModoFormularioProducto("agregar");
  }, []);

  const formProducto = useAdminProductoForm(
    productoEditando,
    modoFormularioProducto,
    cerrarFormularioProducto
  );
  const {
    datosFormularioProducto,
    errorImagenProducto,
    enviandoFormularioProducto,
    subiendoImagenProducto,
    errorUploadImagen,
    erroresFormularioProducto,
    manejarCambioCampoFormulario,
    manejarArchivoSeleccionado,
    manejarGuardarProducto,
    manejarErrorImagen,
  } = formProducto;

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
          const lista = Array.isArray(data) ? data : Array.isArray(data?.pedidos) ? data.pedidos : [];
          setPedidos(lista);
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

  useEffect(() => {
    if (vistaActiva !== "home" || !esAdministrador) return;
    setContenidoHomeCargando(true);
    setContenidoHomeError("");
    homeApi
      .obtenerContenidoHome()
      .then((data) => {
        setContenidoHome({
          galeria: Array.isArray(data.galeria) ? data.galeria : [],
          portada:
            data.portada && data.portada.imagenUrl
              ? { imagenUrl: data.portada.imagenUrl }
              : { imagenUrl: "" },
        });
      })
      .catch((err) => {
        setContenidoHomeError(err?.message || "Error al cargar la home");
      })
      .finally(() => setContenidoHomeCargando(false));
  }, [vistaActiva, esAdministrador]);

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

  const manejarGuardarPedido = useCallback(async () => {
    const resultado = pedidoSchema.safeParse({
      titulo: (pedidoActual.titulo ?? "").trim(),
      descripcion: (pedidoActual.descripcion ?? "").trim(),
      fecha: (pedidoActual.fecha ?? "").trim(),
    });
    if (!resultado.success) {
      const errores = {};
      const errList = resultado.error?.errors;
      if (Array.isArray(errList)) {
        errList.forEach((err) => {
          const path = err.path?.[0];
          if (path) errores[path] = err.message;
        });
      }
      setErroresPedido(errores);
      toast.error("Revisa los campos del pedido.");
      return;
    }
    setErroresPedido({});
    setEnviandoPedido(true);
    try {
      await pedidosApi.crear({
        titulo: resultado.data.titulo,
        descripcion: resultado.data.descripcion,
        fecha: resultado.data.fecha,
      });
      toast.success("Pedido creado correctamente.");
      setPedidoActual({ id: null, titulo: "", descripcion: "", fecha: "" });
      setMostrarFormPedido(false);
      const data = await pedidosApi.obtenerTodos();
      const lista = Array.isArray(data) ? data : Array.isArray(data?.pedidos) ? data.pedidos : [];
      setPedidos(lista);
    } catch (err) {
      toast.error(err?.message || "Error al crear el pedido");
    } finally {
      setEnviandoPedido(false);
    }
  }, [pedidoActual.titulo, pedidoActual.descripcion, pedidoActual.fecha]);

  const manejarPedidoCampoChange = useCallback((campo, valor) => {
    if (campo === "fecha" && valor) {
      const d = new Date(valor);
      if (Number.isNaN(d.getTime()) || d < PEDIDO_FECHA_MIN || d > PEDIDO_FECHA_MAX) {
        setErroresPedido((prev) => ({ ...prev, fecha: "La fecha debe estar entre 1930 y 2025." }));
        setPedidoActual((prev) => ({ ...prev, fecha: "" }));
        return;
      }
    }
    setPedidoActual((prev) => ({ ...prev, [campo]: valor }));
    setErroresPedido((prev) => ({ ...prev, [campo]: undefined }));
  }, []);

  const abrirFormPedido = useCallback(() => {
    setPedidoActual({ id: null, titulo: "", descripcion: "", fecha: "" });
    setErroresPedido({});
    setMostrarFormPedido(true);
  }, []);

  const cerrarFormPedido = useCallback(() => {
    setMostrarFormPedido(false);
    setPedidoActual({ id: null, titulo: "", descripcion: "", fecha: "" });
    setErroresPedido({});
  }, []);

  const manejarEditarPedido = useCallback((pedido) => {
    setPedidoActual({
      id: pedido._id || pedido.id,
      titulo: pedido.titulo ?? "",
      descripcion: pedido.descripcion ?? "",
      fecha: pedido.fecha ? String(pedido.fecha).slice(0, 10) : "",
    });
    setModoPedido("editar");
    setErroresPedido({});
  }, []);

  const manejarEliminarPedido = useCallback(() => {
    toast.info("Eliminar pedidos no está disponible desde el panel.");
  }, []);

  const cargarContenidoHome = useCallback(async () => {
    const data = await homeApi.obtenerContenidoHome();
    setContenidoHome({
      galeria: Array.isArray(data.galeria) ? data.galeria : [],
      portada:
        data.portada && data.portada.imagenUrl
          ? { imagenUrl: data.portada.imagenUrl }
          : { imagenUrl: "" },
    });
  }, []);

  const manejarSubirPortada = useCallback(async (file) => {
    setPortadaSubiendo(true);
    setContenidoHomeError("");
    try {
      const data = await homeApi.subirPortada(file);
      const url = data.imagenUrl || data.portada?.imagenUrl || "";
      setContenidoHome((prev) => ({
        ...prev,
        portada: { imagenUrl: url },
      }));
      toast.success("Imagen de portada actualizada");
    } catch (err) {
      setContenidoHomeError(err?.message || "Error al subir portada");
      toast.error(err?.message || "Error al subir portada");
    } finally {
      setPortadaSubiendo(false);
    }
  }, []);

  const manejarAgregarImagenGaleria = useCallback(async (file, texto) => {
    setGaleriaSubiendo(true);
    setContenidoHomeError("");
    try {
      await homeApi.agregarImagenGaleria(file, texto || "");
      await cargarContenidoHome();
      toast.success("Imagen agregada a la galería");
    } catch (err) {
      setContenidoHomeError(err?.message || "Error al agregar imagen");
      toast.error(err?.message || "Error al agregar imagen");
    } finally {
      setGaleriaSubiendo(false);
    }
  }, [cargarContenidoHome]);

  const manejarActualizarTextoGaleria = useCallback(async (id, texto) => {
    if (id == null) return;
    try {
      await homeApi.actualizarTextoGaleria(id, texto ?? "");
      setContenidoHome((prev) => ({
        ...prev,
        galeria: prev.galeria.map((it) =>
          (it.id ?? it._id) === id ? { ...it, texto: texto ?? "" } : it
        ),
      }));
      toast.success("Texto actualizado");
    } catch (err) {
      toast.error(err?.message || "Error al actualizar texto");
    }
  }, []);

  const manejarReemplazarImagenGaleria = useCallback(async (id, file) => {
    if (id == null) return;
    setGaleriaActualizandoId(id);
    setContenidoHomeError("");
    try {
      await homeApi.reemplazarImagenGaleria(id, file);
      await cargarContenidoHome();
      toast.success("Imagen reemplazada");
    } catch (err) {
      setContenidoHomeError(err?.message || "Error al reemplazar imagen");
      toast.error(err?.message || "Error al reemplazar imagen");
    } finally {
      setGaleriaActualizandoId(null);
    }
  }, [cargarContenidoHome]);

  const manejarEliminarImagenGaleria = useCallback(async (id) => {
    if (id == null) return;
    const confirmado = await confirmarAccion(
      "¿Eliminar esta imagen de la galería?",
      "Se quitará del carrusel de la página de inicio."
    );
    if (!confirmado) return;
    try {
      await homeApi.eliminarImagenGaleria(id);
      setContenidoHome((prev) => ({
        ...prev,
        galeria: prev.galeria.filter((it) => (it.id ?? it._id) !== id),
      }));
      toast.success("Imagen eliminada de la galería");
    } catch (err) {
      toast.error(err?.message || "Error al eliminar");
    }
  }, []);

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
    mostrarFormPedido,
    enviandoPedido,

    datosFormularioProducto,
    errorImagenProducto,
    enviandoFormularioProducto,
    subiendoImagenProducto,
    errorUploadImagen,
    erroresFormularioProducto,
    erroresPedido,

    contenidoHome,
    contenidoHomeCargando,
    contenidoHomeError,
    portadaSubiendo,
    galeriaSubiendo,
    galeriaActualizandoId,

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
    onCancelarFormularioProducto: cerrarFormularioProducto,
    onCambioCampoFormulario: manejarCambioCampoFormulario,
    onErrorImagen: manejarErrorImagen,
    onArchivoSeleccionado: manejarArchivoSeleccionado,

    onNuevoComentarioChange: setNuevoComentario,
    onAgregarRecomendacion: manejarAgregarRecomendacion,
    onEditarRecomendacion: manejarEditarRecomendacion,
    onEliminarRecomendacion: manejarEliminarRecomendacion,
    onCancelarEdicionRecomendacion: manejarCancelarEdicionRecomendacion,

    onPedidoActualChange: setPedidoActual,
    onPedidoCampoChange: manejarPedidoCampoChange,
    onGuardarPedido: manejarGuardarPedido,
    onAbrirFormPedido: abrirFormPedido,
    onCerrarFormPedido: cerrarFormPedido,
    onEditarPedido: manejarEditarPedido,
    onEliminarPedido: manejarEliminarPedido,
    onActualizarEstadoPedido: manejarActualizarEstadoPedido,

    onSubirPortada: manejarSubirPortada,
    onAgregarImagenGaleria: manejarAgregarImagenGaleria,
    onActualizarTextoGaleria: manejarActualizarTextoGaleria,
    onReemplazarImagenGaleria: manejarReemplazarImagenGaleria,
    onEliminarImagenGaleria: manejarEliminarImagenGaleria,
  };
};
