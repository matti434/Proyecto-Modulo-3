# Rolling Motor - Documentación de Servicios

## Índice
1. [Arquitectura de Capas](#arquitectura-de-capas)
2. [Capa de Persistencia](#capa-de-persistencia)
3. [Capa de Servicios](#capa-de-servicios)
4. [Modelos de Datos](#modelos-de-datos)
5. [Flujo de Datos Completo](#flujo-de-datos-completo)

---

## Arquitectura de Capas

El proyecto implementa una arquitectura de 3 capas para separar responsabilidades:

```
┌────────────────────────────────────────┐
│          COMPONENTES/CONTEXTOS         │
│   Consumen servicios, no persistence   │
│   Trabajan con instancias de Model     │
└───────────────────┬────────────────────┘
                    │ Llama a
                    ↓
┌────────────────────────────────────────┐
│         SERVICES (Lógica Negocio)      │
│   usuarioService.js                    │
│   productoService.js                   │
│   ─────────────────────────────────    │
│   ✓ Validaciones de negocio            │
│   ✓ Transformaciones de datos          │
│   ✓ Generación de IDs                  │
│   ✓ Retorna instancias de Model        │
└───────────────────┬────────────────────┘
                    │ Llama a
                    ↓
┌────────────────────────────────────────┐
│     PERSISTENCE (Acceso a Datos)       │
│   Services/persistence/                │
│   ─────────────────────────────────    │
│   ✓ Solo operaciones CRUD              │
│   ✓ Solo LocalStorage                  │
│   ✓ Retorna objetos planos (JSON)      │
│   ✗ NO validaciones                    │
│   ✗ NO transformaciones                │
└───────────────────┬────────────────────┘
                    │ Lee/Escribe
                    ↓
┌────────────────────────────────────────┐
│           LOCAL STORAGE                │
│   ─────────────────────────────────    │
│   usuarios        → Array<Object>      │
│   usuariosSuspendidos → Array<Object>  │
│   productos       → Array<Object>      │
│   carritoMotos    → Array<Object>      │
│   ultimoUsuario   → Object (sesión)    │
└────────────────────────────────────────┘
```

### ¿Por qué esta separación?

1. **Facilita migrar a una API/BD real**: Solo hay que cambiar la capa de persistence
2. **Centraliza validaciones**: No se repiten en múltiples lugares
3. **Testeable**: Cada capa se puede testear independientemente
4. **Mantenible**: Cambios en una capa no afectan otras

---

## Capa de Persistencia

### usuarioPersistence.js
**Ubicación:** `src/Services/persistence/usuarioPersistence.js`

Opera sobre las claves `usuarios` y `usuariosSuspendidos` de localStorage.

```javascript
// Claves de LocalStorage
const STORAGE_KEY = "usuarios";
const SUSPENDED_KEY = "usuariosSuspendidos";

// ═══════════════════════════════════════════════
// OPERACIONES CRUD BÁSICAS
// ═══════════════════════════════════════════════

obtenerTodos()
// Retorna: Array<Object> - todos los usuarios activos
// Ejemplo: [{ id: "abc", nombreDeUsuario: "juan", email: "...", ... }]

obtenerPorId(id)
// Parámetro: id (string)
// Retorna: Object | undefined
// Ejemplo: { id: "abc", nombreDeUsuario: "juan", ... }

agregar(usuario)
// Parámetro: usuario (Object completo con id ya generado)
// Retorna: { exito: true, usuario: Object }

editar(id, datosActualizados)
// Parámetros: id (string), datosActualizados (Object parcial)
// Retorna: { exito: true, usuario: Object } | { exito: false, mensaje: "..." }

eliminar(id)
// Parámetro: id (string)
// Retorna: { exito: true } | { exito: false, mensaje: "..." }

// ═══════════════════════════════════════════════
// BÚSQUEDA
// ═══════════════════════════════════════════════

buscar(termino)
// Parámetro: termino (string) - busca en nombre, email, país
// Retorna: Array<Object> - usuarios que coinciden

// ═══════════════════════════════════════════════
// GESTIÓN DE SUSPENDIDOS
// ═══════════════════════════════════════════════

obtenerSuspendidos()
// Retorna: Array<Object> - usuarios suspendidos

guardarSuspendidos(usuariosSuspendidos)
// Parámetro: Array completo de suspendidos
// Efecto: Reemplaza todo el array en localStorage

moverASuspendidos(id, fechaSuspension)
// Parámetros: id (string), fechaSuspension (string ISO, opcional)
// Efecto: Quita de 'usuarios', agrega a 'usuariosSuspendidos' con fecha
// Retorna: { exito: true, usuario: Object }

reactivar(id)
// Parámetro: id (string) del usuario suspendido
// Efecto: Quita de 'usuariosSuspendidos', agrega a 'usuarios' (sin fechaSuspension)
// Retorna: { exito: true, usuario: Object }

eliminarSuspendido(id)
// Parámetro: id (string)
// Efecto: Elimina permanentemente de suspendidos
// Retorna: { exito: true }
```

---

### productoPersistence.js
**Ubicación:** `src/Services/persistence/productoPersistence.js`

Opera sobre la clave `productos` de localStorage.

```javascript
const STORAGE_KEY = "productos";

// ═══════════════════════════════════════════════
// OPERACIONES CRUD BÁSICAS
// ═══════════════════════════════════════════════

obtenerTodos()
// Retorna: Array<Object>

obtenerPorId(id)
// Retorna: Object | undefined

agregar(producto)
// Parámetro: producto (Object completo con id)
// Retorna: { exito: true, producto: Object }

editar(id, datosActualizados)
// Retorna: { exito: true, producto: Object } | { exito: false, mensaje }

eliminar(id)
// Retorna: { exito: true } | { exito: false, mensaje }

// ═══════════════════════════════════════════════
// CONSULTAS ESPECIALES
// ═══════════════════════════════════════════════

obtenerDestacados()
// Retorna: Array<Object> - productos con destacado === true

obtenerConStock()
// Retorna: Array<Object> - productos con stock === true

obtenerRecientes(limite = 5)
// Parámetro: limite (number)
// Retorna: Array<Object> - últimos N productos por fechaCreacion
```

---

## Capa de Servicios

### usuarioService.js
**Ubicación:** `src/Services/usuarioService.js`

Contiene la lógica de negocio para usuarios. Llama a persistence y retorna **instancias de Model**.

```javascript
import * as persistence from './persistence/usuarioPersistence';
import { Usuario } from '../Models/Usuario';

export const usuarioService = {

  // ═══════════════════════════════════════════════
  // LECTURA (retornan Usuario o Usuario[])
  // ═══════════════════════════════════════════════
  
  obtenerTodos: () => {
    const datos = persistence.obtenerTodos();
    return datos.map(d => Usuario.fromJSON(d));  // ← Convierte a Model
  },
  // Retorna: Usuario[]

  obtenerPorId: (id) => {
    const dato = persistence.obtenerPorId(id);
    return dato ? Usuario.fromJSON(dato) : null;
  },
  // Retorna: Usuario | null

  obtenerSuspendidos: () => {
    const datos = persistence.obtenerSuspendidos();
    return datos.map(d => Usuario.fromJSON(d));
  },
  // Retorna: Usuario[]

  buscar: (termino) => {
    const datos = persistence.buscar(termino);
    return datos.map(d => Usuario.fromJSON(d));
  },
  // Retorna: Usuario[]

  // ═══════════════════════════════════════════════
  // AUTENTICACIÓN
  // ═══════════════════════════════════════════════

  login: (credencial, contrasena) => {
    // 1. Obtiene usuarios de persistence (JSON plano)
    const usuarios = persistence.obtenerTodos();
    
    // 2. Busca coincidencia por email O nombreUsuario + contraseña
    const usuario = usuarios.find(u => {
      const emailMatch = u.email.toLowerCase() === credencial.toLowerCase();
      const nombreMatch = u.nombreDeUsuario.toLowerCase() === credencial.toLowerCase();
      const passMatch = u.contrasena === contrasena;
      return (emailMatch || nombreMatch) && passMatch;
    });

    // 3. Retorna resultado
    if (!usuario) {
      return { exito: false, mensaje: "Credenciales incorrectas" };
    }
    return { exito: true, usuario: Usuario.fromJSON(usuario) };
  },

  registrar: (datos) => {
    // Delega a crear() que tiene validaciones
    return usuarioService.crear(datos);
  },

  // ═══════════════════════════════════════════════
  // CRUD
  // ═══════════════════════════════════════════════

  crear: (datos) => {
    // 1. VALIDACIONES DE NEGOCIO
    const usuarios = usuarioService.obtenerTodos();
    
    if (usuarios.some(u => u.email.toLowerCase() === datos.email?.toLowerCase())) {
      return { exito: false, mensaje: "El email ya está registrado" };
    }
    if (usuarios.some(u => u.nombreDeUsuario.toLowerCase() === datos.nombreDeUsuario?.toLowerCase())) {
      return { exito: false, mensaje: "El nombre de usuario ya existe" };
    }

    // 2. TRANSFORMACIONES
    const nuevoUsuario = {
      ...datos,
      id: crypto.randomUUID(),  // Genera ID aquí, no en persistence
    };

    // 3. Persiste y retorna Model
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

  // ═══════════════════════════════════════════════
  // SUSPENSIÓN
  // ═══════════════════════════════════════════════

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
```

---

### productoService.js
**Ubicación:** `src/Services/productoService.js`

```javascript
import * as persistence from './persistence/productoPersistence';
import { Producto } from '../Models/Producto';

export const productoService = {

  // ═══════════════════════════════════════════════
  // LECTURA
  // ═══════════════════════════════════════════════

  obtenerTodos: () => {
    const datos = persistence.obtenerTodos();
    return datos.map(d => Producto.fromJSON(d));
  },

  obtenerPorId: (id) => {
    const dato = persistence.obtenerPorId(id);
    return dato ? Producto.fromJSON(dato) : null;
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

  // ═══════════════════════════════════════════════
  // CRUD
  // ═══════════════════════════════════════════════

  crear: (datos) => {
    // TRANSFORMACIONES en Service
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
    // TRANSFORMACIONES en Service
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

  actualizarStock: (id, tieneStock) => {
    const producto = productoService.obtenerPorId(id);
    if (!producto) {
      return { exito: false, mensaje: "Producto no encontrado" };
    }
    
    const datosActualizados = { ...producto.toJSON(), stock: tieneStock };
    return productoService.actualizar(id, datosActualizados);
  }
};
```

---

## Modelos de Datos

### Usuario.js
**Ubicación:** `src/Models/Usuario.js`

```javascript
export class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nombreDeUsuario = data.nombreDeUsuario;
    this.email = data.email;
    this.pais = data.pais;
    this.fechaNacimiento = data.fechaNacimiento;
    this.contrasena = data.contrasena;  // ⚠️ Solo en memoria, no exponer
    this.role = data.role || 'usuario'; // 'usuario' | 'admin'
    this.fechaSuspension = data.fechaSuspension; // Solo si está suspendido
  }

  // Factory method para crear desde JSON
  static fromJSON(json) {
    return new Usuario(json);
  }

  // Serializa a JSON (sin contraseña para algunos casos)
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

  // Métodos de instancia
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
```

---

### Producto.js
**Ubicación:** `src/Models/Producto.js`

```javascript
export class Producto {
  constructor(data) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.precio = parseFloat(data.precio) || 0;  // Siempre number internamente
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
      precio: this.precio.toString(),  // String para localStorage
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
      fechaCreacion: this.fechaCreacion,
      fechaModificacion: this.fechaModificacion
    };
  }

  // Getters computados
  get precioFormateado() {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(this.precio);
  }

  get nombreCompleto() {
    return `${this.marca} ${this.modelo}`;
  }

  // Métodos de instancia
  tieneStock() {
    return this.stock === true;
  }

  esDestacado() {
    return this.destacado === true;
  }
}
```

---

## Flujo de Datos Completo

### Ejemplo: Crear un Producto

```
1. Usuario llena formulario en AdminFormularioView
                    ↓
2. onGuardarProducto() en useAdminViewModel
                    ↓
3. agregarProducto() en ContextoProducto
                    ↓
4. productoService.crear(datos)
   - Genera ID con crypto.randomUUID()
   - Agrega fechaCreacion
   - Normaliza precio a string
                    ↓
5. persistence.agregar(producto)
   - Lee array actual de localStorage
   - Hace push del nuevo producto
   - Guarda en localStorage
                    ↓
6. Service recibe resultado y crea Producto.fromJSON()
                    ↓
7. Context recibe Producto, llama toJSON() y actualiza estado
                    ↓
8. UI se re-renderiza con nuevo producto
```

### Ejemplo: Login

```
1. Usuario ingresa credencial + contraseña en FormLoginView
                    ↓
2. handleSubmit() → useFormLoginViewModel.procesarEnvio()
                    ↓
3. context.login({ credencial, contrasena })
                    ↓
4. useAuth.login() llama usuarioService.login()
                    ↓
5. usuarioService.login():
   - persistence.obtenerTodos() → JSON[]
   - Busca match de email/nombre + contraseña
   - Si encuentra: Usuario.fromJSON(match)
   - Retorna { exito: true, usuario: Usuario }
                    ↓
6. useAuth recibe Usuario:
   - usuario.toJSON() para guardar en estado
   - localStorage.setItem("ultimoUsuario", JSON.stringify(...))
   - toast.success("Bienvenido")
                    ↓
7. setUsuarioActual(usuarioJSON) actualiza Context
                    ↓
8. Toda la app re-renderiza con usuario logueado
```

---

## Migración a API Real

Para migrar de localStorage a una API REST:

1. **Solo modificar la capa de persistence**:

```javascript
// usuarioPersistence.js - ANTES (localStorage)
export const obtenerTodos = () => {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
};

// usuarioPersistence.js - DESPUÉS (API)
export const obtenerTodos = async () => {
  const response = await fetch('/api/usuarios');
  return response.json();
};
```

2. **Service y Context no cambian** (solo agregar async/await si es necesario)

3. **UI no cambia en absoluto**
