import * as persistence from './persistence/productoPersistence';
import { Producto } from '../Models';

export const productoService = {
  obtenerTodos: () => {
    const datos = persistence.obtenerTodos();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = persistence.obtenerPorId(id);
    return dato ? Producto.fromJSON(dato) : null;
  },

  crear: (datos) => {
    // Transformaciones y validaciones en Service (no en persistencia)
    const nuevoProducto = {
      ...datos,
      id: crypto.randomUUID(),
      fechaCreacion: new Date().toISOString(),
      stock: datos.stock !== undefined ? datos.stock : true,
      destacado: datos.destacado !== undefined ? datos.destacado : false,
      precio: datos.precio?.toString() || "0",
    };

    const resultado = persistence.agregar(nuevoProducto);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  },

  actualizar: (id, datos) => {
    // Transformaciones en Service
    const datosActualizados = {
      ...datos,
      fechaModificacion: new Date().toISOString(),
      precio: datos.precio?.toString() || datos.precio,
    };

    const resultado = persistence.editar(id, datosActualizados);
    if (resultado.exito) {
      return { exito: true, producto: Producto.fromJSON(resultado.producto) };
    }
    return resultado;
  },

  eliminar: (id) => {
    return persistence.eliminar(id);
  },

  obtenerDestacados: () => {
    const datos = persistence.obtenerDestacados();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerConStock: () => {
    const datos = persistence.obtenerConStock();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerRecientes: (limite = 5) => {
    const datos = persistence.obtenerRecientes(limite);
    return datos.map(d => Producto.fromJSON(d));
  },

  actualizarStock: (id, tieneStock) => {
    const producto = productoService.obtenerPorId(id);
    if (!producto) {
      return { exito: false, mensaje: "Producto no encontrado" };
    }
    
    const datosActualizados = { ...producto.toJSON(), stock: tieneStock };
    return productoService.actualizar(id, datosActualizados);
  }
};
