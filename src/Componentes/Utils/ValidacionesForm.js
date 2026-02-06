import { z } from "zod";

export const PAISES_VALIDOS = [
  "Argentina",
  "Bolivia",
  "Brasil",
  "Chile",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
].sort();

// CAMBIA ESTAS FECHAS ↓↓↓
export const FECHA_MINIMA = new Date(1955, 0, 1);
export const FECHA_MAXIMA = new Date(2007, 11, 31);

export const registroSchema = z.object({
  nombreDeUsuario: z
    .string()
    .min(5, "El nombre de usuario debe tener mínimo 5 caracteres")
    .max(20, "El nombre de usuario no puede superar 20 caracteres")
    .regex(
      /^(?!_)(?!.*\s)[a-zA-Z0-9_]+$/,
      "Solo letras, números y guión bajo. No puede empezar con _ ni contener espacios"
    ),

  email: z
    .string()
    .email("Debe ingresar un email válido")
    .max(100, "El email no puede superar 100 caracteres"),

  pais: z
    .string()
    .min(1, "El país es requerido"),

  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((fecha) => {
      const fechaNac = new Date(fecha);
      return fechaNac >= FECHA_MINIMA && fechaNac <= FECHA_MAXIMA;
    }, "Debes tener entre 18 y 70 años (nacido entre 1955 y 2007)"),

  contrasena: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(50, "La contraseña no puede superar 50 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
      "Debe tener mayúscula, minúscula, número y un símbolo especial"
    ),

  confirmarContrasena: z
    .string()
    .max(50, "La confirmación no puede superar 50 caracteres"),
})
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

export const loginSchema = z.object({
  credencial: z
    .string()
    .min(1, "Ingresa tu usuario o email")
    .max(100, "La credencial no puede superar 100 caracteres")
    .refine(
      (value) => {
        const esEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const esTextoValido = value.trim().length >= 3;
        return esEmailValido || esTextoValido;
      },
      {
        message: "Ingresa un email válido o un nombre de usuario (mínimo 3 caracteres)"
      }
    ),

  contrasena: z
    .string()
    .min(1, "Ingresa tu contraseña")
    .max(50, "La contraseña no puede superar 50 caracteres"),
});

export const recuperarContrasenaSchema = z.object({
  email: z
    .string()
    .email("Debe ingresar un email válido")
    .max(100, "El email no puede superar 100 caracteres"),
});

export const cambiarContrasenaSchema = z.object({
  contrasenaActual: z
    .string()
    .min(1, "Ingresa tu contraseña actual"),

  nuevaContrasena: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
    .max(50, "La nueva contraseña no puede superar 50 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
      "Debe tener mayúscula, minúscula, número y un símbolo especial"
    ),

  confirmarNuevaContrasena: z.string(),
})
  .refine((data) => data.nuevaContrasena === data.confirmarNuevaContrasena, {
    message: "Las nuevas contraseñas no coinciden",
    path: ["confirmarNuevaContrasena"],
  });

const CATEGORIAS_VALIDAS = [
  "motocicletas",
  "protecciones",
  "indumentaria",
  "accesorios",
  "repuestos",
];

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .max(100, "El nombre no puede superar 100 caracteres"),

  precio: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .pipe(
      z
        .number({ message: "El precio debe ser un número" })
        .min(0, "El precio debe ser mayor o igual a 0")
        .refine((n) => Number.isFinite(n) && !Number.isNaN(n), "Solo se permiten números")
    ),

  categoria: z.enum(CATEGORIAS_VALIDAS, {
    errorMap: () => ({ message: "Seleccione una categoría válida" }),
  }),

  imagen: z
    .string()
    .min(1, "La URL de la imagen es obligatoria")
    .url("Debe ser una URL válida")
    .max(500, "La URL no puede superar 500 caracteres"),

  marca: z
    .string()
    .min(1, "La marca es obligatoria")
    .max(30, "La marca no puede superar 30 caracteres"),

  modelo: z
    .string()
    .min(1, "El modelo es obligatorio")
    .max(30, "El modelo no puede superar 30 caracteres"),

  año: z
    .string()
    .max(4)
    .refine((val) => !val || /^\d{4}$/.test(val.trim()), "El año debe ser 4 dígitos (ej: 2023)")
    .optional()
    .or(z.literal("")),

  kilometros: z
    .string()
    .max(50, "Máximo 50 caracteres")
    .optional()
    .or(z.literal("")),

  ubicacion: z
    .string()
    .max(200, "La ubicación no puede superar 200 caracteres")
    .optional()
    .or(z.literal("")),

  descripcion: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(150, "La descripción no puede superar 150 caracteres"),

  destacado: z.boolean(),
  stock: z.boolean(),
});

export const editarUsuarioSchema = z.object({
  nombreDeUsuario: z
    .string()
    .min(5, "El nombre de usuario debe tener mínimo 5 caracteres")
    .max(20, "El nombre de usuario no puede superar 20 caracteres")
    .regex(/^(?!_)(?!.*\s)[a-zA-Z0-9_]+$/, "Solo letras, números y guión bajo. No puede empezar con _ ni contener espacios"),


  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Debe ingresar un email válido")
    .max(100, "El email no puede superar 100 caracteres"),

  pais: z
    .string()
    .min(1, "El país es requerido")
    .refine((val) => PAISES_VALIDOS.includes(val), "Seleccione un país válido de la lista"),

  fechaNacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es requerida")
    .refine((fecha) => {
      const fechaNac = new Date(fecha);
      return fechaNac >= FECHA_MINIMA && fechaNac <= FECHA_MAXIMA;
    }, "Debes tener entre 18 y 70 años (nacido entre 1955 y 2007)"),
});

export const pedidoSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título del pedido es obligatorio")
    .max(50, "El título no puede superar 50 caracteres"),

  descripcion: z
    .string()
    .min(1, "La descripción del pedido es obligatoria")
    .max(150, "La descripción no puede superar 150 caracteres"),
});


export default registroSchema;