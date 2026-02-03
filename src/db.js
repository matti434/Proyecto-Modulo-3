/**
 * Base de datos de usuario administrador
 * Usuario creado para acceso al panel administrativo
 *
 * Credenciales de acceso:
 * - Usuario: admin123
 * - Email: admin@rollingmotor.com
 * - Contraseña: Admin123!@
 */

export const initializeAdminUser = () => {
  const adminUser = {
    id: "admin-001",
    nombreDeUsuario: "admin123",
    email: "admin@rollingmotor.com",
    pais: "Bolivia",    fechaNacimiento: "1985-06-15",
    contrasena: "Admin123!@",
    role: "admin",
  };

  // Verificar si ya existe usuario admin
  const usuariosExistentes = localStorage.getItem("usuarios");
  if (!usuariosExistentes) {
    // Si no hay usuarios, crear array con admin
    localStorage.setItem("usuarios", JSON.stringify([adminUser]));
    console.log("✅ Usuario administrador inicializado correctamente");
    return true;
  } else {
    const usuarios = JSON.parse(usuariosExistentes);
    const adminExiste = usuarios.some((u) => u.role === "admin");

    if (!adminExiste) {
      // Si no existe admin, agregarlo
      usuarios.push(adminUser);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      console.log("✅ Usuario administrador agregado correctamente");
      return true;
    }

    console.log("ℹ️ Usuario administrador ya existe");
    return false;
  }
};

// Exportar datos del usuario admin para referencia
export const ADMIN_USER = {
  username: "admin123",
  email: "admin@rollingmotor.com",
  password: "Admin123!@",
  description: "Usuario administrador para acceso al panel de control",
};
