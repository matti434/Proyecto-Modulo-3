import { Producto } from './Producto';

export class CarritoItem {
  constructor(data) {
    this.id = data.id;
    this.producto = data.productoOriginal ? Producto.fromJSON(data.productoOriginal) : null;
    this.cantidad = data.cantidad || 1;
    this.precio = parseFloat(data.precio) || 0;
    this.nombre = data.nombre || (this.producto ? this.producto.nombreCompleto : '');
    this.imagen = data.imagen || (this.producto ? this.producto.imagen : '');
    this.marca = data.marca || (this.producto ? this.producto.marca : '');
    this.modelo = data.modelo || (this.producto ? this.producto.modelo : '');
  }

  static fromJSON(json) {
    return new CarritoItem(json);
  }

  get subtotal() {
    return this.precio * this.cantidad;
  }

  get subtotalFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.subtotal);
  }

  incrementarCantidad() {
    this.cantidad += 1;
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad -= 1;
    }
  }

  actualizarCantidad(nuevaCantidad) {
    if (nuevaCantidad >= 1) {
      this.cantidad = nuevaCantidad;
    }
  }
}
