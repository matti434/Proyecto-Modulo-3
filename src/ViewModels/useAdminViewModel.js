import { useState, useEffect, useMemo, useCallback } from 'react';
import { useUser } from '../Componentes/Context/ContextoUsuario';
import { useProductos } from '../Componentes/Context/ContextoProducto';
import { productoSchema, pedidoSchema } from '../Componentes/Utils/ValidacionesForm';

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

  // Estado para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [pedidoActual, setPedidoActual] = useState({
    id: null,
    titulo: "",
    descripcion: "",
  });
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

  // Inicializar formulario cuando cambia productoEditando
  useEffect(() => {
    if (modoFormularioProducto === "editar" && productoEditando) {
      setDatosFormularioProducto({
        nombre: productoEditando.nombre || "",
        precio: productoEditando.precio || "",
        descripcion: productoEditando.descripcion || "",
        categoria: productoEditando.categoria || "",
        marca: productoEditando.marca || "",
        modelo: productoEditando.modelo || "",
        año: productoEditando.año || "",
        kilometros: productoEditando.kilometros || "",
        ubicacion: productoEditando.ubicacion || "",
        imagen: productoEditando.imagen || "",
        destacado: productoEditando.destacado || false,
        stock: productoEditando.stock !== undefined ? productoEditando.stock : true,
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
  }, [productoEditando, modoFormularioProducto]);

  // ========== CÁLCULOS (useMemo) ==========
  const estadisticas = useMemo(() => obtenerEstadisticas(), [obtenerEstadisticas, productos]);

  // Cálculos de usuarios
  const totalAdmins = useMemo(() =>
    usuarios.filter((u) => u.role === "admin").length,
    [usuarios]
  );

  const totalNormales = useMemo(() =>
    usuarios.filter((u) => u.role === "user").length,
    [usuarios]
  );

  const totalUsuarios = useMemo(() => usuarios.length, [usuarios]);

  const totalSuspendidos = useMemo(() => usuariosSuspendidos.length, [usuariosSuspendidos]);

  const suspendidosMas30Dias = useMemo(() => {
    return usuariosSuspendidos.filter((u) => {
      const fechaSuspension = new Date(u.fechaSuspension);
      const hoy = new Date();
      const diffDias = Math.floor((hoy - fechaSuspension) / (1000 * 60 * 60 * 24));
      return diffDias > 30;
    }).length;
  }, [usuariosSuspendidos]);

  // Cálculo de valor total de productos
  const valorTotalProductos = useMemo(() => {
    return productos.reduce((total, p) => total + (parseFloat(p.precio) || 0), 0).toFixed(2);
  }, [productos]);

  // ========== FUNCIONES (useCallback) ==========
  const manejarSincronizacion = useCallback(async () => {
    const resultado = await sincronizarConAPI();
    alert(resultado.mensaje);
  }, [sincronizarConAPI]);

  const manejarEditarProducto = useCallback((producto) => {
    setProductoEditando(producto);
    setModoFormularioProducto("editar");
    setMostrarFormProducto(true);
  }, []);

  const manejarEliminarProducto = useCallback(async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer.")) {
      const resultado = await eliminarProducto(id);
      if (resultado.exito) {
        alert("✅ Producto eliminado correctamente");
      } else {
        alert("❌ Error: " + resultado.mensaje);
      }
    }
  }, [eliminarProducto]);

  const manejarAbrirFormularioProducto = useCallback(() => {
    setModoFormularioProducto("agregar");
    setProductoEditando(null);
    setMostrarFormProducto(true);
    // Resetear formulario
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
  }, []);

  const manejarCerrarFormularioProducto = useCallback(() => {
    setMostrarFormProducto(false);
    setProductoEditando(null);
    setModoFormularioProducto("agregar");
    // Resetear formulario
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
  }, []);

  const manejarGuardarProducto = useCallback(async (e) => {
    e.preventDefault();
    const datosParaValidar = {
      ...datosFormularioProducto,
      precio: datosFormularioProducto.precio === "" ? "" : datosFormularioProducto.precio,
    };
    const resultadoValidacion = productoSchema.safeParse(datosParaValidar);
    if (!resultadoValidacion.success) {
      const fieldErrors = resultadoValidacion.error.flatten().fieldErrors;
      const erroresPorCampo = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (Array.isArray(messages) && messages[0]) {
          erroresPorCampo[key] = messages[0];
        } else if (typeof messages === "string") {
          erroresPorCampo[key] = messages;
        }
      }
      setErroresFormularioProducto(erroresPorCampo);
      return;
    }
    setErroresFormularioProducto({});
    setEnviandoFormularioProducto(true);
    try {
      const datosValidos = resultadoValidacion.data;
      const payload = {
        ...datosFormularioProducto,
        precio: typeof datosValidos.precio === "number" ? String(datosValidos.precio) : datosFormularioProducto.precio,
      };
      if (modoFormularioProducto === "editar" && productoEditando) {
        const resultado = await editarProducto(productoEditando.id, payload);
        if (resultado.exito) {
          alert("✅ Producto actualizado correctamente");
          manejarCerrarFormularioProducto();
        } else {
          alert("❌ Error: " + resultado.mensaje);
        }
      } else {
        const resultado = await agregarProducto(payload);
        if (resultado.exito) {
          alert("✅ Producto agregado correctamente");
          manejarCerrarFormularioProducto();
        } else {
          alert("❌ Error: " + resultado.mensaje);
        }
      }
    } catch (error) {
      alert("❌ Error inesperado: " + error.message);
    } finally {
      setEnviandoFormularioProducto(false);
    }
  }, [modoFormularioProducto, productoEditando, datosFormularioProducto, editarProducto, agregarProducto, manejarCerrarFormularioProducto]);

  // Funciones para actualizar campos del formulario
  const manejarCambioCampoFormulario = useCallback((campo, valor) => {
    setDatosFormularioProducto(prev => ({
      ...prev,
      [campo]: valor
    }));
    setErroresFormularioProducto(prev => {
      const next = {...prev};
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

  const manejarGuardarUsuario = useCallback((datosUsuario) => {
    if (usuarioEditando) {
      editarUsuario(usuarioEditando.id, datosUsuario);
      setUsuarioEditando(null);
    }
  }, [usuarioEditando, editarUsuario]);

  const manejarCancelarEdicionUsuario = useCallback(() => {
    setUsuarioEditando(null);
  }, []);

  // Funciones de pedidos
  const manejarGuardarPedido = useCallback(() => {
    if (modoPedido === "agregar") {
      setPedidos([
        ...pedidos,
        {
          id: Date.now(),
          titulo: pedidoActual.titulo,
          descripcion: pedidoActual.descripcion,
        },
      ]);
    } else {
      setPedidos(
        pedidos.map((p) =>
          p.id === pedidoActual.id ? pedidoActual : p
        )
      );
    }
    setPedidoActual({ id: null, titulo: "", descripcion: "" });
    setModoPedido("agregar");
  }, [modoPedido, pedidoActual, pedidos]);

  const manejarEditarPedido = useCallback((pedido) => {
    setPedidoActual(pedido);
    setModoPedido("editar");
  }, []);

  const manejarEliminarPedido = useCallback((id) => {
    setPedidos(pedidos.filter((x) => x.id !== id));
  }, [pedidos]);

  // ========== RETORNO ==========
  return {
    // Datos del Context
    usuarios,
    usuariosSuspendidos,
    productos,
    esAdministrador,
    cargando,
    estadisticas,

    // Estado local
    vistaActiva,
    usuarioEditando,
    productoEditando,
    mostrarFormProducto,
    modoFormularioProducto,
    pedidos,
    pedidoActual,
    modoPedido,
    // Estado del formulario de producto
    datosFormularioProducto,
    errorImagenProducto,
    enviandoFormularioProducto,

    // Valores calculados
    totalAdmins,
    totalNormales,
    totalUsuarios,
    totalSuspendidos,
    suspendidosMas30Dias,
    valorTotalProductos,

    // Funciones de navegación
    onCambiarVista: setVistaActiva,

    // Funciones de sincronización
    onSincronizar: manejarSincronizacion,

    // Funciones de usuarios
    onEditarUsuario: manejarEditarUsuario,
    onSuspenderUsuario: suspenderUsuario,
    onReactivarUsuario: reactivarUsuario,
    onEliminarUsuarioSuspendido: eliminarUsuarioSuspendido,
    onGuardarUsuario: manejarGuardarUsuario,
    onCancelarEdicionUsuario: manejarCancelarEdicionUsuario,

    // Funciones de productos
    onAbrirFormularioProducto: manejarAbrirFormularioProducto,
    onEditarProducto: manejarEditarProducto,
    onEliminarProducto: manejarEliminarProducto,
    onGuardarProducto: manejarGuardarProducto,
    onCancelarFormularioProducto: manejarCerrarFormularioProducto,
    onCambioCampoFormulario: manejarCambioCampoFormulario,
    onErrorImagen: manejarErrorImagen,

    // Funciones de pedidos
    onPedidoActualChange: setPedidoActual,
    onGuardarPedido: manejarGuardarPedido,
    onEditarPedido: manejarEditarPedido,
    onEliminarPedido: manejarEliminarPedido,
  };
};
