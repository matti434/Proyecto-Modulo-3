export class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nombreDeUsuario = data.nombreDeUsuario;
    this.email = data.email;
    this.pais = data.pais;
    this.fechaNacimiento = data.fechaNacimiento;
    this.contrasena = data.contrasena;
    this.role = data.role || 'usuario';
    this.fechaSuspension = data.fechaSuspension;
  }

  static fromJSON(json) {
    return new Usuario(json);
  }

  toJSON() {
    return {
      id: this.id,
      nombreDeUsuario: this.nombreDeUsuario,
      email: this.email,
      pais: this.pais,
      fechaNacimiento: this.fechaNacimiento,
      role: this.role,
      ...(this.fechaSuspension && { fechaSuspension: this.fechaSuspension })
    };
  }

  isValid() {
    return !!(this.email && this.nombreDeUsuario);
  }

  esAdmin() {
    return this.role === 'admin';
  }

  estaSuspendido() {
    return !!this.fechaSuspension;
  }
}
