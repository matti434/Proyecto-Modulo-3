import { useState, useEffect, useCallback } from "react";
import { useProductos } from "../Componentes/Context/ContextoProducto";
import { productosApi } from "../Services/Api";
import toast from "react-hot-toast";
import { productoSchema, LIMITES } from "../Componentes/Utils/ValidacionesForm";

const ESTADO_INICIAL_FORMULARIO = {
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
};

function erroresZodAObjeto(errorZod) {
  const flat =
    typeof errorZod.flatten === "function" ? errorZod.flatten() : { fieldErrors: {} };
  const fieldErrors = flat.fieldErrors || {};
  const resultado = {};
  for (const [campo, mensajes] of Object.entries(fieldErrors)) {
    const msg = Array.isArray(mensajes) ? mensajes[0] : mensajes;
    if (msg) resultado[campo] = msg;
  }
  return resultado;
}

export function useAdminProductoForm(productoEditando, modoFormularioProducto, onCerrar) {
  const { agregarProducto, editarProducto } = useProductos();

  const [datosFormularioProducto, setDatosFormularioProducto] = useState(ESTADO_INICIAL_FORMULARIO);
  const [errorImagenProducto, setErrorImagenProducto] = useState(false);
  const [enviandoFormularioProducto, setEnviandoFormularioProducto] = useState(false);
  const [subiendoImagenProducto, setSubiendoImagenProducto] = useState(false);
  const [errorUploadImagen, setErrorUploadImagen] = useState("");
  const [erroresFormularioProducto, setErroresFormularioProducto] = useState({});

  useEffect(() => {
    const limites = LIMITES.producto;
    if (modoFormularioProducto === "editar" && productoEditando) {
      const s = (val, max) => String(val ?? "").slice(0, max);
      setDatosFormularioProducto({
        nombre: s(productoEditando.nombre, limites.nombre),
        precio:
          productoEditando.precio != null ? String(productoEditando.precio) : "",
        descripcion: s(productoEditando.descripcion, limites.descripcion),
        categoria: productoEditando.categoria || "",
        marca: s(productoEditando.marca, limites.marca),
        modelo: s(productoEditando.modelo, limites.modelo),
        año: s(productoEditando.año, limites.año),
        kilometros: s(productoEditando.kilometros, limites.kilometros),
        ubicacion: s(productoEditando.ubicacion, limites.ubicacion),
        imagen: s(productoEditando.imagen, limites.imagen),
        destacado: productoEditando.destacado || false,
        stock: productoEditando.stock !== undefined ? productoEditando.stock : true,
      });
    } else {
      setDatosFormularioProducto(ESTADO_INICIAL_FORMULARIO);
    }
    setErrorImagenProducto(false);
    setErrorUploadImagen("");
    setErroresFormularioProducto({});
  }, [productoEditando, modoFormularioProducto]);

  const manejarCambioCampoFormulario = useCallback((campo, valor) => {
    setDatosFormularioProducto((prev) => ({ ...prev, [campo]: valor }));
    setErroresFormularioProducto((prev) => {
      const next = { ...prev };
      delete next[campo];
      return next;
    });
  }, []);

  const manejarArchivoSeleccionado = useCallback(
    async (file) => {
      setErrorUploadImagen("");
      setSubiendoImagenProducto(true);
      try {
        const data = await productosApi.subirImagen(file);
        if (data.imagen) {
          manejarCambioCampoFormulario("imagen", data.imagen);
        }
      } catch (err) {
        const mensaje = err?.message || "Error al subir la imagen";
        setErrorUploadImagen(mensaje);
        toast.error(mensaje);
      } finally {
        setSubiendoImagenProducto(false);
      }
    },
    [manejarCambioCampoFormulario]
  );

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
            onCerrar();
          } else {
            toast.error("Error: " + res.mensaje);
          }
        } else {
          const res = await agregarProducto(payload);
          if (res.exito) {
            toast.success("Producto agregado correctamente");
            onCerrar();
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
      onCerrar,
    ]
  );

  const manejarErrorImagen = useCallback((error) => {
    setErrorImagenProducto(error);
  }, []);

  const resetearFormulario = useCallback(() => {
    setDatosFormularioProducto(ESTADO_INICIAL_FORMULARIO);
    setErrorImagenProducto(false);
    setErrorUploadImagen("");
    setErroresFormularioProducto({});
  }, []);

  return {
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
    resetearFormulario,
  };
}
