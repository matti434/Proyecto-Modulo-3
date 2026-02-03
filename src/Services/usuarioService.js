import * as persistence from './persistence/usuarioPersistence';
import { Usuario } from '../Models';

export const usuarioService = {
  obtenerTodos: () => {
    const datos = persistence.obtenerTodos();
    return datos.map(d => Usuario.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = persistence.obtenerPorId(id);
    return dato ? Usuario.fromJSON(dato) : null;
  },

  crear: (datos) => {
    // Validaciones en Service (no en persistencia)
    const usuarios = usuarioService.obtenerTodos();
    
    if (usuarios.some(u => u.email.toLowerCase() === datos.email?.toLowerCase())) {
      return { exito: false, mensaje: "El email ya está registrado" };
    }
    if (usuarios.some(u => u.nombreDeUsuario.toLowerCase() === datos.nombreDeUsuario?.toLowerCase())) {
      return { exito: false, mensaje: "El nombre de usuario ya existe" };
    }

    // Transformaciones en Service
    const nuevoUsuario = {
      ...datos,
      id: crypto.randomUUID(),
    };

    const resultado = persistence.agregar(nuevoUsuario);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  actualizar: (id, datos) => {
    const resultado = persistence.editar(id, datos);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  eliminar: (id) => {
    return persistence.eliminar(id);
  },

  login: (credencial, contrasena) => {
    const usuarios = persistence.obtenerTodos();

    const usuario = usuarios.find(u => {
      if (!u.email || !u.nombreDeUsuario) return false;

      const emailMatch = u.email.toLowerCase() === (credencial || "").toLowerCase();
      const nombreMatch = u.nombreDeUsuario.toLowerCase() === (credencial || "").toLowerCase();
      const passMatch = u.contrasena === contrasena;

      return (emailMatch || nombreMatch) && passMatch;
    });

    if (!usuario) {
      return { exito: false, mensaje: "Credenciales incorrectas" };
    }

    return { exito: true, usuario: Usuario.fromJSON(usuario) };
  },

  registrar: (datos) => {
    // Usar crear() que ya tiene validaciones y convierte a Model
    return usuarioService.crear(datos);
  },

  buscar: (termino) => {
    const datos = persistence.buscar(termino);
    return datos.map(d => Usuario.fromJSON(d));
  },

  obtenerSuspendidos: () => {
    const datos = persistence.obtenerSuspendidos();
    return datos.map(d => Usuario.fromJSON(d));
  },

  suspender: (id, fechaSuspension) => {
    const resultado = persistence.moverASuspendidos(id, fechaSuspension);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  reactivar: (id) => {
    const resultado = persistence.reactivar(id);
    if (resultado.exito) {
      return { exito: true, usuario: Usuario.fromJSON(resultado.usuario) };
    }
    return resultado;
  },

  eliminarSuspendido: (id) => {
    return persistence.eliminarSuspendido(id);
  }
};
