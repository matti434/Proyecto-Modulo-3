/**
 * Utilidades de validación para el buscador de productos
 */

/**
 * Limpia y valida el término de búsqueda
 * @param {string} valor - Valor a validar
 * @returns {string} - Valor limpio
 */
export const validarTerminoBusqueda = (valor) => {
  if (!valor) return '';
  
  // Eliminar espacios al inicio y final
  let valorLimpio = valor.trim();
  
  // Solo permitir caracteres alfanuméricos y espacios
  valorLimpio = valorLimpio.replace(/[^a-zA-Z0-9\s]/g, '');
  
  // Limitar a 50 caracteres
  if (valorLimpio.length > 50) {
    valorLimpio = valorLimpio.substring(0, 50);
  }
  
  return valorLimpio;
};

/**
 * Valida si el término de búsqueda cumple con la longitud mínima
 * @param {string} valor - Valor a validar
 * @returns {boolean} - True si es válido
 */
export const tieneLongitudMinima = (valor) => {
  if (!valor) return true; // Vacío es válido
  return valor.trim().length >= 3;
};

/**
 * Limpia y valida un campo numérico (precio)
 * @param {string} valor - Valor a validar
 * @returns {string} - Valor limpio
 */
export const validarCampoNumerico = (valor) => {
  if (!valor) return '';
  
  // Solo números
  let valorLimpio = valor.replace(/\D/g, '');
  
  // Limitar a 7 dígitos
  if (valorLimpio.length > 7) {
    valorLimpio = valorLimpio.substring(0, 7);
  }
  
  // Validar que no exceda el máximo
  const numero = parseInt(valorLimpio, 10);
  if (numero > 9999999) {
    valorLimpio = '9999999';
  }
  
  return valorLimpio;
};

/**
 * Valida el rango de precios (mínimo vs máximo)
 * @param {string} precioMin - Precio mínimo
 * @param {string} precioMax - Precio máximo
 * @returns {string} - Mensaje de error o string vacío si es válido
 */
export const validarRangoPrecios = (precioMin, precioMax) => {
  if (!precioMin || !precioMax) return '';
  
  const min = parseInt(precioMin, 10);
  const max = parseInt(precioMax, 10);
  
  if (min > max) {
    return 'El precio mínimo no puede ser mayor que el máximo';
  }
  
  return '';
};

/**
 * Previene la entrada de caracteres inválidos en tiempo real
 * @param {Event} e - Evento de teclado
 * @param {string} tipo - Tipo de campo ('alfanumerico' o 'numerico')
 */
export const prevenirCaracteresInvalidos = (e, tipo = 'alfanumerico') => {
  const teclasPermitidas = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];
  
  if (teclasPermitidas.includes(e.key)) {
    return; // Permitir teclas de control
  }
  
  if (tipo === 'numerico') {
    // Solo permitir números
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  } else if (tipo === 'alfanumerico') {
    // Permitir letras, números y espacio
    if (!/^[a-zA-Z0-9\s]$/.test(e.key)) {
      e.preventDefault();
    }
  }
};

/**
 * Valida todos los filtros antes de enviar
 * @param {Object} filtros - Objeto con todos los filtros
 * @returns {Object} - Objeto con errores por campo
 */
export const validarTodosLosFiltros = (filtros) => {
  const errores = {};
  
  // Validar término de búsqueda
  if (filtros.terminoBusqueda && filtros.terminoBusqueda.trim().length < 3) {
    errores.terminoBusqueda = 'Mínimo 3 caracteres para realizar la búsqueda';
  }
  
  // Validar rango de precios
  const errorRango = validarRangoPrecios(filtros.precioMin, filtros.precioMax);
  if (errorRango) {
    errores.precioMin = errorRango;
    errores.precioMax = errorRango;
  }
  
  // Validar que los precios sean positivos
  if (filtros.precioMin && parseInt(filtros.precioMin, 10) < 0) {
    errores.precioMin = 'El precio no puede ser negativo';
  }
  
  if (filtros.precioMax && parseInt(filtros.precioMax, 10) < 0) {
    errores.precioMax = 'El precio no puede ser negativo';
  }
  
  return errores;
};

/**
 * Limpia todos los filtros aplicando trim y validaciones
 * @param {Object} filtros - Filtros a limpiar
 * @returns {Object} - Filtros limpios
 */
export const limpiarTodosLosFiltros = (filtros) => {
  return {
    terminoBusqueda: validarTerminoBusqueda(filtros.terminoBusqueda || ''),
    categoria: (filtros.categoria || '').trim(),
    precioMin: validarCampoNumerico(filtros.precioMin || ''),
    precioMax: validarCampoNumerico(filtros.precioMax || ''),
    marca: (filtros.marca || '').trim(),
    modelo: (filtros.modelo || '').trim()
  };
};

/**
 * Configuración de validaciones HTML5 para los campos
 */
export const configuracionValidaciones = {
  terminoBusqueda: {
    pattern: '^[a-zA-Z0-9\\s]{0,50}$',
    title: 'Solo letras, números y espacios. Máximo 50 caracteres.',
    maxLength: 50
  },
  precioMin: {
    pattern: '^\\d{0,7}$',
    title: 'Solo números enteros positivos. Máximo 7 dígitos.',
    maxLength: 7
  },
  precioMax: {
    pattern: '^\\d{0,7}$',
    title: 'Solo números enteros positivos. Máximo 7 dígitos.',
    maxLength: 7
  }
};

export default {
  validarTerminoBusqueda,
  tieneLongitudMinima,
  validarCampoNumerico,
  validarRangoPrecios,
  prevenirCaracteresInvalidos,
  validarTodosLosFiltros,
  limpiarTodosLosFiltros,
  configuracionValidaciones
};