/**
 * Validaciones de formularios con Zod.
 * Cada "schema" describe las reglas de un formulario (registro, login, producto, etc.).
 */

import { z } from "zod";

// ============== CONSTANTES COMPARTIDAS ==============

export const PAISES_VALIDOS = [
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica", "Cuba",
  "Ecuador", "El Salvador", "España", "Estados Unidos", "Guatemala", "Honduras",
  "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico",
  "República Dominicana", "Uruguay", "Venezuela",
].sort();

// Límites de fecha de nacimiento (edad entre 18 y 70 años)
export const FECHA_MINIMA = new Date(1955, 0, 1);
export const FECHA_MAXIMA = new Date(2007, 11, 31);

// ============== FUNCIONES AUXILIARES DE VALIDACIÓN ==============

/** Verifica que la fecha tenga formato YYYY-MM-DD y sea una fecha real. */
function esFechaValida(fecha) {
  if (!fecha || typeof fecha !== "string") return false;
  const formatoCorrecto = /^\d{4}-\d{2}-\d{2}$/.test(fecha.trim());
  if (!formatoCorrecto) return false;
  const d = new Date(fecha);
  return !Number.isNaN(d.getTime());
}

/** Verifica que la fecha esté dentro del rango permitido (1955-2007). */
function fechaEnRangoPermitido(fecha) {
  const d = new Date(fecha);
  return d >= FECHA_MINIMA && d <= FECHA_MAXIMA;
}

// Patrones permitidos para campos de texto (reutilizables)
const SOLO_LETRAS_ESPACIOS_COMAS = /^[a-zA-ZáéíóúÁÉÍÓúñÑüÜ\s,]+$/;
const LETRAS_NUMEROS_ESPACIOS_GUIONES = /^[a-zA-Z0-9áéíóúÁÉÍÓúñÑüÜ\s\-.,]+$/;
const MARCA_O_MODELO = /^[a-zA-Z0-9áéíóúÁÉÍÓúñÑüÜ\s\-]+$/;
const KILOMETROS_OPCIONAL = /^[\d\s.,]+(\s*km)?$/i;

const CATEGORIAS_PRODUCTO = ["motocicletas", "protecciones", "indumentaria", "accesorios", "repuestos"];

// ============== SCHEMAS: REGISTRO DE USUARIO ==============

export const registroSchema = z
  .object({
    nombreDeUsuario: z
      .string()
      .min(5, "Mínimo 5 caracteres")
      .max(20, "Máximo 20 caracteres")
      .regex(/^(?!_)(?!.*\s)[a-zA-Z0-9_]+$/, "Solo letras, números y _; sin espacios ni empezar con _"),

    email: z.string().email("Email válido").max(100, "Máximo 100 caracteres"),

    pais: z.string().min(1, "El país es requerido"),

    fechaNacimiento: z
      .string()
      .min(1, "La fecha es requerida")
      .refine(esFechaValida, "Formato: año-mes-día")
      .refine(fechaEnRangoPermitido, "Debes tener entre 18 y 70 años (1955-2007)"),

    contrasena: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(50, "Máximo 50 caracteres")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, "Mayúscula, minúscula, número y un símbolo"),

    confirmarContrasena: z.string().max(50, "Máximo 50 caracteres"),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

// ============== SCHEMAS: LOGIN Y CONTRASEÑAS ==============

export const loginSchema = z.object({
  credencial: z
    .string()
    .min(1, "Usuario o email")
    .max(100, "Máximo 100 caracteres")
    .refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.trim().length >= 3,
      { message: "Email válido o usuario (mín. 3 caracteres)" }
    ),
  contrasena: z.string().min(1, "Contraseña requerida").max(50, "Máximo 50 caracteres"),
});

export const recuperarContrasenaSchema = z.object({
  email: z.string().email("Email válido").max(100, "Máximo 100 caracteres"),
});

export const cambiarContrasenaSchema = z
  .object({
    contrasenaActual: z.string().min(1, "Contraseña actual requerida"),
    nuevaContrasena: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .max(50, "Máximo 50 caracteres")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, "Mayúscula, minúscula, número y símbolo"),
    confirmarNuevaContrasena: z.string(),
  })
  .refine((data) => data.nuevaContrasena === data.confirmarNuevaContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarNuevaContrasena"],
  });

// ============== SCHEMAS: CRUD ADMIN (PRODUCTO, USUARIO, PEDIDO) ==============
// Única fuente de verdad para límites de caracteres (usar en formularios y validación)

export const LIMITES = {
  producto: {
    nombre: 20,
    precio: 15,
    imagen: 1000,
    marca: 20,
    modelo: 20,
    año: 4,
    kilometros: 20,
    ubicacion: 60,
    descripcion: 150,
  },
  pedido: { titulo: 50, descripcion: 150 },
  usuario: { nombreDeUsuario: 20, email: 60 },
};

const P = LIMITES.producto;
const U = LIMITES.usuario;
const D = LIMITES.pedido;

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "Nombre obligatorio")
    .max(P.nombre, `Máximo ${P.nombre} caracteres`)
    .regex(LETRAS_NUMEROS_ESPACIOS_GUIONES, "Solo letras, números, espacios, guiones, puntos y comas"),

  precio: z
    .union([z.string(), z.number()])
    .refine((val) => typeof val !== "string" || val.length <= P.precio, `Máximo ${P.precio} caracteres`)
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .pipe(z.number().min(0, "El precio debe ser mayor o igual a 0").refine(Number.isFinite, "Debe ser un número")),

  categoria: z.enum(CATEGORIAS_PRODUCTO, {
    errorMap: () => ({ message: "Seleccione una categoría válida" }),
  }),

  imagen: z.string().min(1, "URL obligatoria").url("URL válida").max(P.imagen, `Máximo ${P.imagen} caracteres`),

  marca: z
    .string()
    .min(1, "Marca obligatoria")
    .max(P.marca, `Máximo ${P.marca} caracteres`)
    .regex(MARCA_O_MODELO, "Solo letras, números, espacios y guiones"),

  modelo: z
    .string()
    .min(1, "Modelo obligatorio")
    .max(P.modelo, `Máximo ${P.modelo} caracteres`)
    .regex(MARCA_O_MODELO, "Solo letras, números, espacios y guiones"),

  año: z
    .string()
    .max(P.año)
    .refine((val) => !val?.trim() || /^\d{4}$/.test(val.trim()), "Año: 4 dígitos (ej. 2023)")
    .optional()
    .or(z.literal("")),

  kilometros: z
    .string()
    .max(P.kilometros)
    .refine((val) => !val?.trim() || KILOMETROS_OPCIONAL.test(val?.trim()), "Solo números; puede incluir \" km\"")
    .optional()
    .or(z.literal("")),

  ubicacion: z
    .string()
    .max(P.ubicacion)
    .refine((val) => !val?.trim() || SOLO_LETRAS_ESPACIOS_COMAS.test(val?.trim()), "Solo letras, espacios y comas")
    .optional()
    .or(z.literal("")),

  descripcion: z.string().min(1, "Descripción obligatoria").max(P.descripcion, `Máximo ${P.descripcion} caracteres`),
  destacado: z.boolean(),
  stock: z.boolean(),
});

export const editarUsuarioSchema = z.object({
  nombreDeUsuario: z
    .string()
    .min(5, "Mínimo 5 caracteres")
    .max(U.nombreDeUsuario, `Máximo ${U.nombreDeUsuario} caracteres`)
    .regex(/^(?!_)(?!.*\s)[a-zA-Z0-9_]+$/, "Solo letras, números y _; sin espacios ni _ al inicio"),

  email: z.string().min(1, "Email requerido").email("Email válido").max(U.email, `Máximo ${U.email} caracteres`),

  pais: z
    .string()
    .min(1, "País requerido")
    .refine((val) => PAISES_VALIDOS.includes(val), "Seleccione un país de la lista"),

  fechaNacimiento: z
    .string()
    .min(1, "Fecha requerida")
    .refine(esFechaValida, "Formato: año-mes-día")
    .refine(fechaEnRangoPermitido, "Entre 18 y 70 años (1955-2007)"),
});

export const pedidoSchema = z.object({
  titulo: z.string().min(1, "Título obligatorio").max(D.titulo, `Máximo ${D.titulo} caracteres`),
  descripcion: z.string().min(1, "Descripción obligatoria").max(D.descripcion, `Máximo ${D.descripcion} caracteres`),
});

export default registroSchema;
