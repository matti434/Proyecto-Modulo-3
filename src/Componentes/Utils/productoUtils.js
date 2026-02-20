/**
 * Utilidades para manejo de productos
 * Centraliza código duplicado de CardProducto y DetalleProducto
 */

/** Base URL del backend para rutas legacy de imagen */
const BASE_URL_IMAGEN = import.meta.env.VITE_API_URL
  ? new URL(import.meta.env.VITE_API_URL).origin
  : "http://localhost:5000";

/**
 * Devuelve la URL lista para <img src>. Soporta:
 * - URL completa (https://res.cloudinary.com/...): se usa tal cual.
 * - Ruta legacy (/Galeria/..., /Productos/...): se concatena con base del backend.
 * - Vacío/null/undefined: devuelve undefined para mostrar placeholder.
 */
export const getImagenProductoUrl = (imagen) => {
  if (!imagen || typeof imagen !== "string") return undefined;
  const trimmed = imagen.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return `${BASE_URL_IMAGEN}${trimmed}`;
  return trimmed;
};

/** URL de imagen placeholder cuando no hay imagen */
export const IMAGEN_PLACEHOLDER = "/Productos/imgCard.jpg";

/**
 * Crea un objeto de producto normalizado con valores por defecto
 * @param {Object} props - Props del producto
 * @returns {Object} Producto normalizado
 */
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

/**
 * Genera un ID único para productos del carrito
 * @returns {string} ID único
 */
export const generarIdCarrito = () => {
  return `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida si un producto tiene stock disponible
 * @param {Object} producto - Producto a validar
 * @returns {boolean}
 */
export const validarStock = (producto) => {
  if (!producto) return false;
  return producto.stock === true || producto.stock === "true";
};

/**
 * Formatea el precio para mostrar con separador de miles
 * @param {number|string} precioStr - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatearPrecio = (precioStr) => {
  if (!precioStr) return "0";
  const numero = parseInt(String(precioStr).replace(/\D/g, ""));
  return isNaN(numero) ? "0" : numero.toLocaleString("es-ES");
};

/**
 * Formatea los kilómetros para mostrar
 * @param {number|string} kmStr - Kilómetros a formatear
 * @returns {string} Kilómetros formateados con "km"
 */
export const formatearKilometros = (kmStr) => {
  if (!kmStr) return "0 km";
  const numero = parseInt(String(kmStr).replace(/\D/g, ""));
  return isNaN(numero) ? "0 km" : numero.toLocaleString("es-ES") + " km";
};

/**
 * Trunca texto largo agregando "..."
 * @param {string} texto - Texto a truncar
 * @param {number} maxLength - Longitud máxima (default 75)
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, maxLength = 75) => {
  if (!texto || texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + "...";
};

/**
 * Acorta ubicación para mostrar en cards
 * @param {string} ubicacionStr - Ubicación completa
 * @param {number} maxLength - Longitud máxima (default 20)
 * @returns {string} Ubicación acortada
 */
export const acortarUbicacion = (ubicacionStr, maxLength = 20) => {
  if (!ubicacionStr) return "";
  if (ubicacionStr.length <= maxLength) return ubicacionStr;
  return ubicacionStr.substring(0, maxLength) + "...";
};

/**
 * Valores por defecto para un producto cuando no hay datos
 */
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