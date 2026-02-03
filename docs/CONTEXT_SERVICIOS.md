# Context y Servicios - Documentación Detallada

## 📚 Índice

1. [Sistema de Contextos](#sistema-de-contextos)
2. [ContextoUsuario](#contextousuario)
3. [ContextoProducto](#contextoproducto)
4. [ContextoCarrito](#contextocarrito)
5. [serviciosGenerales.js](#serviciosgeneralesjs)
6. [Flujo de Datos](#flujo-de-datos)
7. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Sistema de Contextos

### ¿Qué son los Contextos?

Los Contextos de React permiten compartir estado y funciones entre componentes sin necesidad de pasar props manualmente en cada nivel. En este proyecto, se usan 3 contextos principales:

1. **ContextoUsuario** - Gestión de usuarios y autenticación
2. **ContextoProducto** - Gestión de productos y filtrado
3. **ContextoCarrito** - Gestión del carrito de compras

### Arquitectura

```
App.jsx
├── CarritoProvider (más externo)
│   ├── ProveedorProductos
│   │   ├── UserProvider (más interno)
│   │   │   └── Componentes de la app
```

**Orden importante:** Los providers más externos pueden usar los más internos, pero no al revés.

---

## ContextoUsuario

### Ubicación
`src/Componentes/Context/ContextoUsuario.jsx`

### Estructura Modular

El contexto está dividido en hooks modulares para mejor organización:

```
ContextoUsuario.jsx (87 líneas)
├── hooks/useAuth.js (57 líneas)
├── hooks/useUsuariosManagement.js (91 líneas)
└── hooks/useUsuarioData.js (10 líneas)
```

### Estado que Gestiona

```javascript
const [usuarios, setUsuarios] = useState([]);              // Usuarios activos
const [usuariosSuspendidos, setUsuariosSuspendidos] = useState([]); // Usuarios suspendidos
const [usuarioActual, setUsuarioActual] = useState(null);  // Usuario logueado
const [cargando, setCargando] = useState(true);            // Estado de carga
```

### Funciones Principales

#### Autenticación (useAuth.js)

##### `login(credenciales)`
**Parámetros:**
```javascript
{
  credencial: string,  // Email o nombre de usuario
  contrasena: string   // Contraseña
}
```

**Retorna:**
```javascript
{
  login: boolean,      // true si fue exitoso
  usuario: object,     // Datos del usuario
  esAdmin: boolean     // Si es administrador
}
```

**Funcionamiento:**
1. Llama a `servicios.loginUsuario()`
2. Si es exitoso:
   - Actualiza `usuarioActual`
   - Guarda en localStorage (`ultimoUsuario`)
   - Muestra toast de éxito
   - Retorna datos del usuario
3. Si falla:
   - Muestra toast de error
   - Retorna `{ login: false, mensaje: "..." }`

**Ejemplo:**
```javascript
const { login } = useUser();
const resultado = await login({
  credencial: "admin@ejemplo.com",
  contrasena: "Admin123!"
});
```

##### `logout()`
**Funcionamiento:**
1. Limpia `usuarioActual` (setea a `null`)
2. Elimina `ultimoUsuario` de localStorage
3. Muestra toast de éxito

**Ejemplo:**
```javascript
const { logout } = useUser();
logout();
```

##### `registrarUsuario(datos)`
**Parámetros:**
```javascript
{
  nombreDeUsuario: string,
  email: string,
  pais: string,
  fechaNacimiento: string,
  contrasena: string
}
```

**Retorna:**
```javascript
{
  registrado: boolean,
  usuario: object,
  mensaje: string
}
```

**Funcionamiento:**
1. Crea nuevo usuario con `crypto.randomUUID()` como ID
2. Asigna `role: "usuario"` por defecto
3. Llama a `servicios.agregarUsuario()`
4. Si es exitoso:
   - Agrega a lista de usuarios
   - Establece como usuario actual
   - Guarda en localStorage
   - Muestra toast de éxito

#### Gestión de Usuarios (useUsuariosManagement.js)

##### `suspenderUsuario(id)`
**Funcionamiento:**
1. Busca usuario en lista de activos
2. Valida que no sea admin (los admins no se pueden suspender)
3. Llama a `servicios.suspenderUsuario()`
4. Mueve usuario de `usuarios` a `usuariosSuspendidos`
5. Muestra toast de éxito/error

**Validaciones:**
- Usuario debe existir
- Usuario no puede ser admin

##### `reactivarUsuario(id)`
**Funcionamiento:**
1. Busca usuario en lista de suspendidos
2. Llama a `servicios.reactivarUsuario()`
3. Mueve usuario de `usuariosSuspendidos` a `usuarios`
4. Elimina `fechaSuspension` del objeto usuario
5. Muestra toast de éxito/error

##### `eliminarUsuarioSuspendido(id)`
**Funcionamiento:**
1. Busca usuario en lista de suspendidos
2. Valida que no sea admin
3. Muestra confirmación (`window.confirm`)
4. Si confirma:
   - Llama a `servicios.eliminarUsuarioSuspendido()`
   - Elimina de `usuariosSuspendidos`
   - Muestra toast de éxito

**⚠️ Importante:** Esta acción es permanente e irreversible.

##### `editarUsuario(id, nuevosDatos)`
**Parámetros:**
```javascript
id: string,
nuevosDatos: {
  nombreDeUsuario?: string,
  email?: string,
  pais?: string,
  // ... otros campos
}
```

**Funcionamiento:**
1. Llama a `servicios.editarUsuario()`
2. Actualiza usuario en lista de `usuarios`
3. Si el usuario editado es el actual:
   - Actualiza `usuarioActual`
   - Actualiza localStorage
4. Muestra toast de éxito/error

##### `actualizarUsuarioActual(nuevosDatos)`
**Funcionamiento:**
1. Valida que haya un usuario actual
2. Fusiona datos actuales con nuevos datos
3. Actualiza `usuarioActual`
4. Actualiza en localStorage
5. Actualiza en lista de usuarios
6. Muestra toast de éxito

**Uso típico:** Para actualizar perfil del usuario logueado.

#### Consultas (useUsuarioData.js)

##### `obtenerUsuarioPorId(id)`
**Retorna:** Objeto usuario o `undefined`

**Funcionamiento:**
- Llama directamente a `servicios.obtenerUsuarioPorId()`
- No modifica estado, solo consulta

##### `buscarUsuarios(termino)`
**Parámetros:**
```javascript
termino: string  // Término de búsqueda
```

**Retorna:** Array de usuarios que coinciden

**Funcionamiento:**
- Busca en: `nombreDeUsuario`, `email`, `pais`
- Búsqueda case-insensitive
- Si termino está vacío, retorna todos los usuarios

### Valores Computados

```javascript
esAdministrador: usuarioActual?.role === "admin"  // Boolean
estaAutenticado: !!usuarioActual                  // Boolean
```

### Carga Inicial

El contexto carga datos automáticamente al montarse:

1. Obtiene usuarios y suspendidos desde localStorage
2. Busca `ultimoUsuario` en localStorage
3. Si existe y es válido, lo establece como `usuarioActual`
4. Si no es válido, limpia localStorage

### Hook de Uso

```javascript
import { useUser } from '../Context/ContextoUsuario';

const MiComponente = () => {
  const {
    usuarioActual,
    usuarios,
    login,
    logout,
    esAdministrador,
    estaAutenticado
  } = useUser();
  
  // Usar valores y funciones...
};
```

---

## ContextoProducto

### Ubicación
`src/Componentes/Context/ContextoProducto.jsx`

### Estado que Gestiona

```javascript
const [productos, setProductos] = useState([]);           // Lista completa
const [productosFiltrados, setProductosFiltrados] = useState([]); // Lista filtrada
const [cargando, setCargando] = useState(true);            // Estado de carga
const [error, setError] = useState(null);                  // Errores
const [filtros, setFiltros] = useState({                   // Filtros activos
  categoria: "",
  terminoBusqueda: "",
  precioMin: "",
  precioMax: "",
  marca: "",
  modelo: "",
  destacado: "",
  stock: ""
});
```

### Funciones Principales

#### Carga de Datos

##### `cargarProductos()`
**Funcionamiento:**
1. Establece `cargando: true`
2. Llama a `servicios.obtenerProductos()`
3. Actualiza estado `productos`
4. Establece `cargando: false`
5. Maneja errores y los guarda en `error`

**Se ejecuta automáticamente:** Al montar el componente y cuando se llama manualmente.

#### Filtrado

##### `productosFiltrados` (computed)
**Funcionamiento:**
Filtra `productos` según los filtros activos:

1. **Por categoría:** Coincidencia exacta (case-insensitive)
2. **Por término de búsqueda:** Busca en:
   - `nombre`
   - `marca`
   - `modelo`
   - `descripcion`
3. **Por precio:** Rango entre `precioMin` y `precioMax`
4. **Por marca:** Coincidencia exacta (case-insensitive)
5. **Por modelo:** Coincidencia exacta (case-insensitive)
6. **Por destacado:** Filtro booleano
7. **Por stock:** Filtro booleano

**Lógica:** Todos los filtros se aplican con AND (todos deben cumplirse).

##### `actualizarFiltros(nuevosFiltros)`
**Parámetros:**
```javascript
{
  categoria?: string,
  terminoBusqueda?: string,
  precioMin?: string,
  precioMax?: string,
  // ... otros filtros
}
```

**Funcionamiento:**
- Fusiona filtros actuales con nuevos
- Actualiza estado `filtros`
- `productosFiltrados` se recalcula automáticamente

##### `limpiarFiltros()`
**Funcionamiento:**
- Resetea todos los filtros a valores vacíos
- `productosFiltrados` vuelve a ser igual a `productos`

##### `filtrarPorCategoria(categoria)`
**Funcionamiento:**
- Establece solo el filtro de categoría
- Limpia otros filtros

#### CRUD de Productos

##### `agregarProducto(producto)`
**Parámetros:**
```javascript
{
  nombre: string,
  precio: number|string,
  descripcion: string,
  categoria: string,
  marca: string,
  modelo: string,
  año: string,
  imagen: string,
  stock?: boolean,
  destacado?: boolean
}
```

**Retorna:**
```javascript
{
  exito: boolean,
  producto?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Llama a `servicios.agregarProducto()`
2. Si es exitoso:
   - Agrega producto a `productos`
   - Retorna producto creado
3. Si falla:
   - Retorna error

##### `editarProducto(id, datosActualizados)`
**Funcionamiento:**
1. Llama a `servicios.editarProducto()`
2. Si es exitoso:
   - Actualiza producto en `productos`
   - Retorna producto actualizado
3. Si falla:
   - Retorna error

##### `eliminarProducto(id)`
**Funcionamiento:**
1. Llama a `servicios.eliminarProducto()`
2. Si es exitoso:
   - Elimina producto de `productos`
   - Retorna éxito
3. Si falla:
   - Retorna error

#### Consultas y Utilidades

##### `obtenerCategoriasUnicas()`
**Retorna:** Array de strings (nombres de categorías únicas)

**Funcionamiento:**
- Extrae todas las categorías de productos
- Elimina duplicados
- Retorna array ordenado

##### `obtenerMarcasPorCategoria(categoria)`
**Retorna:** Array de strings (marcas únicas en esa categoría)

##### `obtenerProductosPorCategoria(categoria)`
**Retorna:** Array de productos de esa categoría

##### `obtenerProductoPorId(id)`
**Retorna:** Objeto producto o `undefined`

##### `obtenerEstadisticas()`
**Retorna:**
```javascript
{
  total: number,
  conStock: number,
  sinStock: number,
  destacados: number,
  porCategoria: { [categoria]: number }
}
```

##### `obtenerRangoPrecios()`
**Retorna:**
```javascript
{
  min: number,
  max: number,
  promedio: number
}
```

##### `buscarSugerencias(termino)`
**Parámetros:**
```javascript
termino: string  // Mínimo 2 caracteres
```

**Retorna:** Array de hasta 5 productos que coinciden

**Funcionamiento:**
- Busca en nombre, marca, modelo
- Retorna máximo 5 resultados
- Ordenados por relevancia

##### `obtenerProductosDestacados()`
**Retorna:** Array de productos con `destacado: true`

##### `obtenerProductosConStock()`
**Retorna:** Array de productos con `stock: true`

##### `obtenerProductosRecientes(limite = 5)`
**Retorna:** Array de productos más recientes ordenados por `fechaCreacion`

##### `actualizarStockProducto(id, tieneStock)`
**Funcionamiento:**
- Actualiza solo el campo `stock` de un producto
- Llama internamente a `editarProducto()`

### Hook de Uso

```javascript
import { useProductos } from '../Context/ContextoProducto';

const MiComponente = () => {
  const {
    productos,
    productosFiltrados,
    filtros,
    cargando,
    agregarProducto,
    actualizarFiltros,
    obtenerCategoriasUnicas
  } = useProductos();
  
  // Usar valores y funciones...
};
```

---

## ContextoCarrito

### Ubicación
`src/Componentes/Context/ContextoCarrito.jsx`

### Estado que Gestiona

```javascript
const [itemsCarrito, setItemsCarrito] = useState([]);
```

**Estructura de un item:**
```javascript
{
  id: string,
  nombre: string,              // "Marca Modelo"
  precio: number,
  cantidad: number,
  imagen: string,
  productoOriginal: object,    // Producto completo
  descuento: number,
  marca: string,
  modelo: string
}
```

### Persistencia Automática

El carrito se guarda automáticamente en localStorage:

- **Al cargar:** Lee `carritoMotos` de localStorage
- **Al cambiar:** Guarda `itemsCarrito` en localStorage

### Funciones Principales

#### `agregarAlCarrito(producto, cantidad = 1)`
**Parámetros:**
```javascript
producto: {
  id?: string,
  marca: string,
  modelo: string,
  precio: number|string,
  imagen: string,
  // ... otros campos
},
cantidad: number  // Default: 1
```

**Funcionamiento:**
1. Si el producto no tiene ID, genera uno único
2. Busca si el producto ya está en el carrito
3. Si existe:
   - Incrementa la cantidad
4. Si no existe:
   - Crea nuevo item con estructura completa
   - Agrega a `itemsCarrito`

**Estructura del item creado:**
```javascript
{
  id: producto.id || `producto-${timestamp}-${random}`,
  nombre: `${marca} ${modelo}`,
  precio: parseFloat(precio),
  cantidad: cantidad,
  imagen: imagen,
  productoOriginal: producto,
  descuento: 0,
  marca: marca,
  modelo: modelo
}
```

#### `eliminarDelCarrito(productoId)`
**Funcionamiento:**
- Filtra `itemsCarrito` eliminando el item con ese ID

#### `actualizarCantidad(productoId, nuevaCantidad)`
**Funcionamiento:**
1. Si `nuevaCantidad < 1`:
   - Elimina el producto del carrito
2. Si `nuevaCantidad >= 1`:
   - Actualiza la cantidad del item

#### `vaciarCarrito()`
**Funcionamiento:**
- Establece `itemsCarrito` a array vacío
- También limpia localStorage

#### `calcularSubtotal()`
**Retorna:** `number` - Suma de (precio × cantidad) de todos los items

**Cálculo:**
```javascript
itemsCarrito.reduce((total, item) => 
  total + (item.precio * item.cantidad), 0
)
```

#### `calcularTotalProductos()`
**Retorna:** `number` - Suma total de cantidades (no precios)

**Cálculo:**
```javascript
itemsCarrito.reduce((total, item) => 
  total + item.cantidad, 0
)
```

#### `estaEnCarrito(productoId)`
**Retorna:** `boolean` - Si el producto está en el carrito

#### `obtenerCantidadProducto(productoId)`
**Retorna:** `number` - Cantidad del producto en el carrito (0 si no está)

### Hook de Uso

```javascript
import { useCarrito } from '../Context/ContextoCarrito';

const MiComponente = () => {
  const {
    itemsCarrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    calcularSubtotal,
    calcularTotalProductos
  } = useCarrito();
  
  // Usar valores y funciones...
};
```

---

## serviciosGenerales.js

### Ubicación
`src/Servicios/serviciosGenerales.js`

### Propósito

Servicio centralizado que maneja todas las operaciones de datos usando localStorage como persistencia. Actúa como capa de abstracción entre los contextos y el almacenamiento.

### Estructura

El archivo contiene funciones organizadas en dos secciones principales:

1. **Funciones de Usuarios** (líneas 2-144)
2. **Funciones de Productos** (líneas 147-219)

### Funciones de Usuarios

#### Operaciones Básicas

##### `obtenerUsuarios()`
**Retorna:** `Array` - Lista de usuarios activos

**Funcionamiento:**
- Lee `localStorage.getItem("usuarios")`
- Parsea JSON
- Retorna array vacío si no existe

##### `guardarUsuarios(usuarios)`
**Parámetros:**
```javascript
usuarios: Array
```

**Funcionamiento:**
- Convierte array a JSON
- Guarda en `localStorage.setItem("usuarios", ...)`

##### `obtenerUsuarioPorId(id)`
**Retorna:** `Object|undefined` - Usuario encontrado

**Funcionamiento:**
- Obtiene todos los usuarios
- Busca por ID
- Retorna usuario o `undefined`

#### CRUD de Usuarios

##### `agregarUsuario(usuario)`
**Parámetros:**
```javascript
usuario: {
  nombreDeUsuario: string,
  email: string,
  pais: string,
  fechaNacimiento: string,
  contrasena: string,
  role?: string  // Opcional, default: "usuario"
}
```

**Retorna:**
```javascript
{
  exito: boolean,
  usuario?: object,
  mensaje?: string
}
```

**Validaciones:**
1. Verifica que el email no esté registrado (case-insensitive)
2. Verifica que el nombre de usuario no exista (case-insensitive)

**Funcionamiento:**
1. Si pasa validaciones:
   - Genera ID único con `crypto.randomUUID()`
   - Agrega usuario a array
   - Guarda en localStorage
   - Retorna `{ exito: true, usuario: nuevoUsuario }`
2. Si falla validación:
   - Retorna `{ exito: false, mensaje: "..." }`

##### `editarUsuario(id, datosActualizados)`
**Parámetros:**
```javascript
id: string,
datosActualizados: {
  nombreDeUsuario?: string,
  email?: string,
  // ... otros campos
}
```

**Retorna:**
```javascript
{
  exito: boolean,
  usuario?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Busca usuario por ID
2. Si no existe: retorna error
3. Fusiona datos actuales con nuevos datos
4. Guarda en localStorage
5. Retorna usuario actualizado

##### `eliminarUsuario(id)`
**Retorna:**
```javascript
{
  exito: boolean,
  mensaje?: string
}
```

**Funcionamiento:**
1. Filtra usuarios eliminando el que coincide con ID
2. Guarda en localStorage
3. Verifica que se eliminó (compara longitudes)
4. Retorna éxito o error

#### Usuarios Suspendidos

##### `obtenerUsuariosSuspendidos()`
**Retorna:** `Array` - Lista de usuarios suspendidos

**Almacenamiento:** `localStorage.getItem("usuariosSuspendidos")`

##### `guardarUsuariosSuspendidos(usuariosSuspendidos)`
**Funcionamiento:**
- Guarda array en `localStorage.setItem("usuariosSuspendidos", ...)`

##### `suspenderUsuario(id, fechaSuspension)`
**Parámetros:**
```javascript
id: string,
fechaSuspension: string  // ISO string, default: new Date().toISOString()
```

**Retorna:**
```javascript
{
  exito: boolean,
  usuario?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Busca usuario en lista de activos
2. Si no existe: retorna error
3. Agrega `fechaSuspension` al usuario
4. Mueve de `usuarios` a `usuariosSuspendidos`
5. Guarda ambas listas en localStorage
6. Retorna usuario suspendido

##### `reactivarUsuario(id)`
**Funcionamiento:**
1. Busca usuario en lista de suspendidos
2. Si no existe: retorna error
3. Elimina `fechaSuspension` del usuario
4. Mueve de `usuariosSuspendidos` a `usuarios`
5. Guarda ambas listas en localStorage
6. Retorna usuario reactivado

##### `eliminarUsuarioSuspendido(id)`
**Funcionamiento:**
1. Busca usuario en lista de suspendidos
2. Si no existe: retorna error
3. Elimina de `usuariosSuspendidos`
4. Guarda en localStorage
5. Retorna éxito

**⚠️ Importante:** Esta acción es permanente.

#### Autenticación

##### `loginUsuario(credencial, contrasena)`
**Parámetros:**
```javascript
credencial: string,  // Email o nombre de usuario
contrasena: string
```

**Retorna:**
```javascript
{
  exito: boolean,
  usuario?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Obtiene todos los usuarios
2. Busca usuario donde:
   - (`email` o `nombreDeUsuario`) coincida con `credencial` (case-insensitive)
   - Y `contrasena` coincida exactamente
3. Si encuentra:
   - Retorna `{ exito: true, usuario }`
4. Si no encuentra:
   - Retorna `{ exito: false, mensaje: "Credenciales incorrectas" }`

**Nota:** La contraseña se compara en texto plano (no hay hash).

#### Búsqueda

##### `buscarUsuarios(termino)`
**Parámetros:**
```javascript
termino: string
```

**Retorna:** `Array` - Usuarios que coinciden

**Funcionamiento:**
1. Si término está vacío: retorna todos los usuarios
2. Busca en:
   - `nombreDeUsuario` (case-insensitive)
   - `email` (case-insensitive)
   - `pais` (case-insensitive)
3. Retorna array filtrado

### Funciones de Productos

#### Operaciones Básicas

##### `obtenerProductos()`
**Retorna:** `Array` - Lista de productos

**Almacenamiento:** `localStorage.getItem("productos")`

##### `guardarProductos(productos)`
**Funcionamiento:**
- Guarda array en `localStorage.setItem("productos", ...)`

##### `obtenerProductoPorId(id)`
**Retorna:** `Object|undefined` - Producto encontrado

#### CRUD de Productos

##### `agregarProducto(producto)`
**Parámetros:**
```javascript
producto: {
  nombre: string,
  precio: number|string,
  descripcion: string,
  categoria: string,
  marca: string,
  modelo: string,
  año: string,
  imagen: string,
  stock?: boolean,      // Default: true
  destacado?: boolean   // Default: false
}
```

**Retorna:**
```javascript
{
  exito: boolean,
  producto: object
}
```

**Funcionamiento:**
1. Genera ID único con `crypto.randomUUID()`
2. Agrega `fechaCreacion: new Date().toISOString()`
3. Establece defaults: `stock: true`, `destacado: false`
4. Convierte `precio` a string
5. Agrega a array de productos
6. Guarda en localStorage
7. Retorna producto creado

##### `editarProducto(id, datosActualizados)`
**Parámetros:**
```javascript
id: string,
datosActualizados: {
  nombre?: string,
  precio?: number|string,
  // ... otros campos
}
```

**Retorna:**
```javascript
{
  exito: boolean,
  producto?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Busca producto por ID
2. Si no existe: retorna error
3. Fusiona datos actuales con nuevos
4. Agrega `fechaModificacion: new Date().toISOString()`
5. Convierte `precio` a string si existe
6. Guarda en localStorage
7. Retorna producto actualizado

##### `eliminarProducto(id)`
**Retorna:**
```javascript
{
  exito: boolean,
  mensaje?: string
}
```

**Funcionamiento:**
1. Filtra productos eliminando el que coincide con ID
2. Guarda en localStorage
3. Verifica que se eliminó
4. Retorna éxito o error

#### Consultas Especializadas

##### `obtenerProductosDestacados()`
**Retorna:** `Array` - Productos con `destacado: true`

##### `obtenerProductosConStock()`
**Retorna:** `Array` - Productos con `stock: true`

##### `obtenerProductosRecientes(limite = 5)`
**Parámetros:**
```javascript
limite: number  // Default: 5
```

**Retorna:** `Array` - Productos más recientes

**Funcionamiento:**
1. Obtiene todos los productos
2. Ordena por `fechaCreacion` (más reciente primero)
3. Retorna primeros `limite` productos

##### `actualizarStockProducto(id, tieneStock)`
**Parámetros:**
```javascript
id: string,
tieneStock: boolean
```

**Retorna:**
```javascript
{
  exito: boolean,
  producto?: object,
  mensaje?: string
}
```

**Funcionamiento:**
1. Obtiene producto por ID
2. Si no existe: retorna error
3. Llama a `editarProducto()` con `{ stock: tieneStock }`
4. Retorna resultado

---

## Flujo de Datos

### Ejemplo: Agregar Producto al Carrito

```
1. Usuario hace click en "Agregar al carrito"
   ↓
2. Componente llama: agregarAlCarrito(producto)
   ↓
3. ContextoCarrito actualiza itemsCarrito
   ↓
4. useEffect detecta cambio y guarda en localStorage
   ↓
5. Componente se re-renderiza con nuevo estado
```

### Ejemplo: Login de Usuario

```
1. Usuario envía formulario de login
   ↓
2. Componente llama: login(credenciales)
   ↓
3. ContextoUsuario llama: servicios.loginUsuario()
   ↓
4. serviciosGenerales busca en localStorage
   ↓
5. Si encuentra: retorna usuario
   ↓
6. ContextoUsuario actualiza usuarioActual
   ↓
7. Guarda en localStorage (ultimoUsuario)
   ↓
8. Muestra toast de éxito
   ↓
9. Componente redirige según rol
```

### Ejemplo: Filtrar Productos

```
1. Usuario cambia filtro en buscador
   ↓
2. Componente llama: actualizarFiltros(nuevosFiltros)
   ↓
3. ContextoProducto actualiza estado filtros
   ↓
4. productosFiltrados se recalcula automáticamente
   ↓
5. Componente se re-renderiza con productos filtrados
```

---

## Ejemplos de Uso

### Ejemplo 1: Login en un Componente

```javascript
import { useUser } from '../Context/ContextoUsuario';

const LoginForm = () => {
  const { login, cargando } = useUser();
  const [credenciales, setCredenciales] = useState({
    credencial: '',
    contrasena: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await login(credenciales);
    if (resultado.login) {
      // Redirigir o mostrar mensaje
      console.log('Login exitoso:', resultado.usuario);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  );
};
```

### Ejemplo 2: Mostrar Productos Filtrados

```javascript
import { useProductos } from '../Context/ContextoProducto';

const ListaProductos = () => {
  const { productosFiltrados, cargando, filtros } = useProductos();

  if (cargando) return <div>Cargando...</div>;

  return (
    <div>
      {productosFiltrados.map(producto => (
        <ProductoCard key={producto.id} producto={producto} />
      ))}
    </div>
  );
};
```

### Ejemplo 3: Agregar al Carrito

```javascript
import { useCarrito } from '../Context/ContextoCarrito';

const ProductoCard = ({ producto }) => {
  const { agregarAlCarrito, estaEnCarrito } = useCarrito();
  const enCarrito = estaEnCarrito(producto.id);

  const handleAgregar = () => {
    agregarAlCarrito(producto, 1);
  };

  return (
    <div>
      <h3>{producto.nombre}</h3>
      <button onClick={handleAgregar} disabled={enCarrito}>
        {enCarrito ? 'En carrito' : 'Agregar al carrito'}
      </button>
    </div>
  );
};
```

### Ejemplo 4: Usar Servicios Directamente

```javascript
import * as servicios from '../Servicios/serviciosGenerales';

// Obtener todos los productos
const productos = servicios.obtenerProductos();

// Buscar usuario por ID
const usuario = servicios.obtenerUsuarioPorId('123');

// Agregar nuevo producto
const resultado = servicios.agregarProducto({
  nombre: 'Nueva Moto',
  precio: 10000,
  // ... otros campos
});

if (resultado.exito) {
  console.log('Producto agregado:', resultado.producto);
}
```

---

## Notas Importantes

1. **Persistencia:** Todos los datos se guardan en localStorage (no hay backend)
2. **IDs:** Se generan con `crypto.randomUUID()` para usuarios y productos
3. **Validaciones:** Los servicios validan datos antes de guardar
4. **Errores:** Todas las funciones retornan objetos con `exito: boolean`
5. **Case-Insensitive:** Las búsquedas son case-insensitive
6. **Sincronización:** Los contextos se sincronizan automáticamente con localStorage
7. **Performance:** Los filtros se calculan en cada render (considerar memoización si hay muchos productos)

---

## Mejoras Futuras Sugeridas

1. **Memoización:** Usar `useMemo` para `productosFiltrados` en ContextoProducto
2. **Validación de Esquemas:** Usar Zod o Yup para validar datos
3. **Manejo de Errores:** Sistema centralizado de manejo de errores
4. **Caché:** Implementar caché para consultas frecuentes
5. **Paginación:** Agregar paginación para listas grandes
6. **Backend:** Migrar a API REST cuando sea necesario
