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

export default registroSchema;