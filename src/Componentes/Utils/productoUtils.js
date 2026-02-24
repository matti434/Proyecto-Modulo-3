export const IMAGEN_PLACEHOLDER = "/Productos/imgCard.jpg";

export const crearProductoData = ({
  id,
  marca = "",
  modelo = "",
  año = "",
  precio = "",
  imagen = "",
  kilometros = "",
  ubicacion = "",
  descripcion = "",
  destacado = false,
  stock = true,
  categoria = "",
  nombre = "",
} = {}) => ({
  id: id || Date.now().toString(),
  marca,
  modelo,
  año,
  precio,
  imagen: imagen || IMAGEN_PLACEHOLDER,
  kilometros,
  ubicacion,
  descripcion,
  destacado,
  stock,
  categoria,
  nombre: nombre || `${marca} ${modelo}`.trim(),
});

export const generarIdCarrito = () => {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const validarStock = (producto) => {
  if (!producto) return false;
  return producto.stock === true || producto.stock === "true";
};

const MAX_DIGITOS_PRECIO = 14;

export const formatearPrecio = (precioStr) => {
  if (!precioStr) return "0";
  const numero = parseInt(String(precioStr).replace(/\D/g, ""), 10);
  if (Number.isNaN(numero)) return "0";
  const str = numero.toLocaleString("es-ES");
  if (str.length > MAX_DIGITOS_PRECIO) {
    return str.slice(0, MAX_DIGITOS_PRECIO) + "...";
  }
  return str;
};

export const formatearKilometros = (kmStr) => {
  if (!kmStr) return "0 km";
  const numero = parseInt(String(kmStr).replace(/\D/g, ""));
  return isNaN(numero) ? "0 km" : numero.toLocaleString("es-ES") + " km";
};

export const truncarTexto = (texto, maxLength = 75) => {
  if (!texto || texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + "...";
};

export const acortarUbicacion = (ubicacionStr, maxLength = 20) => {
  if (!ubicacionStr) return "";
  if (ubicacionStr.length <= maxLength) return ubicacionStr;
  return ubicacionStr.substring(0, maxLength) + "...";
};

export const PRODUCTO_DEFAULT = {
  id: null,
  marca: "Royal Enfield",
  modelo: "Classic 350",
  año: 2020,
  precio: "450.000",
  imagen: "https://images.pexels.com/photos/5192876/pexels-photo-5192876.jpeg",
  kilometros: "12.000",
  ubicacion: "Buenos Aires, AR",
  descripcion: "Moto en excelente estado, mantenimiento al día. Perfecta para ciudad y rutas cortas.",
  destacado: false,
  stock: true,
};