export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.precio = parseFloat(data.precio) || 0;
    this.categoria = data.categoria;
    this.marca = data.marca;
    this.modelo = data.modelo;
    this.año = data.año;
    this.descripcion = data.descripcion;
    this.imagen = data.imagen;
    this.kilometros = data.kilometros;
    this.ubicacion = data.ubicacion;
    this.stock = data.stock !== undefined ? data.stock : true;
    this.destacado = data.destacado || false;
    this.esFavorito = data.esFavorito || false;
    this.fechaCreacion = data.fechaCreacion;
    this.fechaModificacion = data.fechaModificacion;
  }

  static fromJSON(json) {
    return new Producto(json);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio.toString(),
      categoria: this.categoria,
      marca: this.marca,
      modelo: this.modelo,
      año: this.año,
      descripcion: this.descripcion,
      imagen: this.imagen,
      kilometros: this.kilometros,
      ubicacion: this.ubicacion,
      stock: this.stock,
      destacado: this.destacado,
      esFavorito: this.esFavorito,
      fechaCreacion: this.fechaCreacion,
      fechaModificacion: this.fechaModificacion
    };
  }

  get precioFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.precio);
  }

  get nombreCompleto() {
    return `${this.marca} ${this.modelo}`;
  }

  tieneStock() {
    return this.stock === true;
  }

  esDestacado() {
    return this.destacado === true;
  }
}
