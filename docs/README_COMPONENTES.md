# Rolling Motor - Documentación de Componentes

## Índice
1. [Contextos Globales](#contextos-globales)
2. [Componentes de Vista](#componentes-de-vista)
3. [Componentes Admin](#componentes-admin)
4. [Componentes Compartidos](#componentes-compartidos)
5. [Utilidades](#utilidades)

---

## Contextos Globales

### ContextoUsuario.jsx
**Ubicación:** `src/Componentes/Context/ContextoUsuario.jsx`

Maneja todo el estado relacionado con usuarios.

```javascript
// Hook para acceder
import { useUser } from './Componentes/Context/ContextoUsuario';

const { 
  // Datos
  usuarios,           // Array de usuarios activos
  usuariosSuspendidos,// Array de usuarios suspendidos
  usuarioActual,      // Usuario logueado (o null)
  cargando,           // Boolean - true mientras carga datos
  
  // Computed
  esAdministrador,    // Boolean - usuarioActual?.role === 'admin'
  estaAutenticado,    // Boolean - !!usuarioActual
  
  // Acciones de Auth
  login,              // (credenciales) => { login: true/false, usuario?, mensaje? }
  logout,             // () => void
  registrarUsuario,   // (datos) => { registrado: true/false, usuario?, mensaje? }
  
  // Acciones de Gestión
  suspenderUsuario,   // (id) => resultado
  reactivarUsuario,   // (id) => resultado
  eliminarUsuarioSuspendido, // (id) => resultado
  editarUsuario,      // (id, datos) => resultado
  
  // Consultas
  obtenerUsuarioPorId, // (id) => Usuario | null
  buscarUsuarios,     // (termino) => Usuario[]
  
  // Utilidades
  sincronizarConAPI,  // () => { exito, mensaje }
  cargarDatos,        // () => void - recarga desde localStorage
} = useUser();
```

**Hooks internos extraídos:**
- `useAuth.js` - login, logout, registrar
- `useUsuarioData.js` - obtenerPorId, buscar
- `useUsuariosManagement.js` - suspender, reactivar, eliminar, editar

---

### ContextoProducto.jsx
**Ubicación:** `src/Componentes/Context/ContextoProducto.jsx`

Maneja productos y filtros.

```javascript
import { useProductos } from './Componentes/Context/ContextoProducto';

const {
  // Datos
  productos,           // Array de todos los productos
  productosFiltrados,  // Productos después de aplicar filtros
  cargando,            // Boolean
  error,               // String | null
  filtros,             // Objeto con filtros activos
  
  // Acciones de Filtros
  actualizarFiltros,   // (nuevosFiltros) => void
  limpiarFiltros,      // () => void
  filtrarPorCategoria, // (categoria) => void
  
  // Consultas
  obtenerCategoriasUnicas,    // () => string[]
  obtenerMarcasPorCategoria,  // (categoria) => string[]
  obtenerProductosPorCategoria, // (categoria) => Producto[]
  obtenerEstadisticas,        // () => { total, porCategoria, ... }
  obtenerRangoPrecios,        // () => { min, max, promedio }
  buscarSugerencias,          // (termino) => Producto[] (max 5)
  obtenerProductoPorId,       // (id) => Producto | null
  obtenerProductosDestacados, // () => Producto[]
  obtenerProductosConStock,   // () => Producto[]
  obtenerProductosRecientes,  // (limite?) => Producto[]
  
  // CRUD
  cargarProductos,     // () => void - recarga desde localStorage
  agregarProducto,     // (producto) => { exito, producto?, mensaje? }
  editarProducto,      // (id, datos) => { exito, producto?, mensaje? }
  eliminarProducto,    // (id) => { exito, mensaje? }
  actualizarStockProducto, // (id, tieneStock) => { exito, producto? }
} = useProductos();
```

**Estructura de filtros:**
```javascript
{
  categoria: "",        // Filtrar por categoría
  terminoBusqueda: "",  // Búsqueda de texto
  precioMin: "",        // Precio mínimo
  precioMax: "",        // Precio máximo
  marca: "",            // Filtrar por marca
  modelo: "",           // Filtrar por modelo
  destacado: "",        // "true" | "false" | ""
  stock: "",            // "true" | "false" | ""
}
```

---

### ContextoCarrito.jsx
**Ubicación:** `src/Componentes/Context/ContextoCarrito.jsx`

Maneja el carrito de compras. Persiste automáticamente en `localStorage.carritoMotos`.

```javascript
import { useCarrito } from './Componentes/Context/ContextoCarrito';

const {
  itemsCarrito,        // Array de items en carrito
  
  // Acciones
  agregarAlCarrito,    // (producto, cantidad = 1) => void
  eliminarDelCarrito,  // (productoId) => void
  actualizarCantidad,  // (productoId, nuevaCantidad) => void
  vaciarCarrito,       // () => void
  
  // Consultas
  calcularSubtotal,       // () => number
  calcularTotalProductos, // () => number (suma de cantidades)
  estaEnCarrito,          // (productoId) => boolean
  obtenerCantidadProducto, // (productoId) => number
} = useCarrito();
```

**Estructura de item en carrito:**
```javascript
{
  id: "uuid",
  nombre: "Royal Enfield Classic 350",
  precio: 450000,           // number
  cantidad: 1,
  imagen: "/ruta/imagen.jpg",
  productoOriginal: {...},  // Objeto producto completo
  descuento: 0,
  marca: "Royal Enfield",
  modelo: "Classic 350"
}
```

---

## Componentes de Vista

### Home
**Ubicación:** `src/Componentes/Views/Home/`

| Archivo | Descripción |
|---------|-------------|
| `Home.jsx` | Página principal, combina Portada y Galería |
| `inicio/Portada.jsx` | Hero section con imagen y CTA |
| `galeria/Galeria.jsx` | Galería de imágenes de motos |

---

### Login y Registro

Siguen patrón **MVVM completo**:

```
Login/
├── Login.jsx              # Wrapper/Modal
├── FormLogin/
│   ├── FormLogin.jsx          # Componente padre
│   ├── FormLoginView.jsx      # Vista pura (solo JSX)
│   └── useFormLoginViewModel.js  # Lógica (useState, handlers)
└── useLoginViewModel.jsx  # VM del modal

Registro/
├── Registro.jsx           # Wrapper/Modal
├── FormRegistro/
│   ├── FormRegistro.jsx
│   ├── FormRegistroView.jsx
│   └── useFormRegistroViewModel.js
└── useRegistroViewModel.js
```

**Props de FormLoginView:**
```javascript
{
  // Estado
  mostrarContrasena,    // Boolean - mostrar/ocultar password
  estaEnviando,         // Boolean - loading state
  errorGeneral,         // String | null - error del servidor
  isValid,              // Boolean - form válido
  isDirty,              // Boolean - form modificado
  
  // Valores observados
  credencial,           // String - valor actual
  contrasena,           // String - valor actual
  
  // react-hook-form
  register,             // Función para registrar inputs
  handleSubmit,         // Handler del form
  errors,               // Objeto de errores por campo
  
  // Handlers
  toggleMostrarContrasena,
  limitarCaracteres,    // (e, maxLength) => void
  limpiarErrorGeneral,
  manejarClickRegistro, // Abre modal de registro
  
  // Callbacks
  onClose,              // Cierra el modal
}
```

---

### Productos

```
Productos/
├── ComponenteProducto/
│   ├── Categorias/
│   │   └── Categorias.jsx    # Grid de categorías clicables
│   │
│   └── PaginaProductos/
│       ├── PaginaProductos.jsx      # Página contenedora
│       │
│       ├── card-Producto/
│       │   └── CardProducto.jsx     # Tarjeta de producto
│       │
│       ├── componenteBuscarProducto/
│       │   └── BuscadorProducto.jsx # Input de búsqueda
│       │
│       ├── Lista-Productos/
│       │   ├── ListaProductos.jsx   # Grid de productos
│       │   ├── ListaProductosContainer.jsx
│       │   └── ListaProductosView.jsx
│       │
│       └── Detalle-Producto/
│           └── DetalleProducto.jsx  # Página de detalle
│
├── componenteCarrito/
│   ├── Carrito.jsx
│   ├── CarritoContainer.jsx
│   └── CarritoView.jsx
│
└── Ofertas/
    ├── Ofertas.jsx
    └── OfertaItem.jsx
```

**CardProducto Props:**
```javascript
{
  id,           // String - UUID
  marca,        // String - "Royal Enfield"
  modelo,       // String - "Classic 350"
  año,          // String/Number - 2024
  precio,       // String - "450000"
  imagen,       // String - URL de imagen
  kilometros,   // String - "12000"
  ubicacion,    // String - "Buenos Aires, AR"
  descripcion,  // String - texto descriptivo
  destacado,    // Boolean - producto destacado
  stock,        // Boolean - disponible
}
```

**DetalleProducto:**
- Recibe datos vía `location.state.producto` (desde navigate)
- Si no hay datos, usa valores por defecto de `PRODUCTO_DEFAULT`

---

### Contacto
**Ubicación:** `src/Componentes/Views/Contacto/Contacto.jsx`

Formulario de contacto que envía emails usando EmailJS.

---

### Otras Vistas

| Vista | Ubicación | Descripción |
|-------|-----------|-------------|
| Nosotros | `Views/Nosotros/` | Página "Sobre nosotros" |
| Pagina404 | `Views/Pagina404/` | Error 404 |

---

## Componentes Admin

**Acceso:** Solo usuarios con `role: "admin"`  
**Ruta:** `/admin` (protegida por `RutaProtegida.jsx`)

```
Admin/
├── AdminPanelContainer.jsx   # Conecta ViewModel con View
├── AdminPanelView.jsx        # Vista principal con navegación de tabs
├── AdminUsuariosView.jsx     # Lista y gestión de usuarios
├── AdminProductosView.jsx    # CRUD de productos
├── AdminSuspendidosView.jsx  # Usuarios suspendidos
├── AdminFormularioView.jsx   # Modal agregar/editar producto
├── AdminRecomendacionesView.jsx  # Notas internas
├── AdminPedidosView.jsx      # Gestión de pedidos
├── ModalEditarUsuarioView.jsx # Modal editar usuario
├── MapaUsuarios.jsx          # Mapa Leaflet con ubicación usuarios
└── AdminPanel.css            # Estilos
```

### useAdminViewModel

Retorna todo el estado y acciones del panel admin:

```javascript
{
  // Datos del Context
  usuarios,              // Usuario[]
  usuariosSuspendidos,   // Usuario[]
  productos,             // Producto[]
  esAdministrador,       // Boolean
  cargando,              // Boolean
  estadisticas,          // Objeto con stats de productos
  
  // Estado local de UI
  vistaActiva,           // "usuarios" | "productos" | "suspendidos" | "recomendaciones" | "pedidos"
  usuarioEditando,       // Usuario | null
  productoEditando,      // Producto | null
  mostrarFormProducto,   // Boolean
  modoFormularioProducto, // "agregar" | "editar"
  
  // Estado de formulario de producto
  datosFormularioProducto,  // Objeto con campos del form
  errorImagenProducto,      // Boolean
  enviandoFormularioProducto, // Boolean
  
  // Estado de recomendaciones
  recomendaciones,       // Array de notas
  nuevoComentario,       // String
  modoEdicion,           // Boolean
  
  // Estado de pedidos
  pedidos,               // Array de pedidos
  pedidoActual,          // Pedido en edición
  modoPedido,            // "agregar" | "editar"
  
  // Valores calculados
  totalAdmins,           // Number
  totalNormales,         // Number
  totalUsuarios,         // Number
  totalSuspendidos,      // Number
  suspendidosMas30Dias,  // Number
  valorTotalProductos,   // String (formateado)
  
  // Funciones de navegación
  onCambiarVista,        // (vista) => void
  
  // Funciones de usuarios
  onEditarUsuario,       // (usuario) => void
  onSuspenderUsuario,    // (id) => void
  onReactivarUsuario,    // (id) => void
  onEliminarUsuarioSuspendido, // (id) => void
  onGuardarUsuario,      // (datos) => void
  onCancelarEdicionUsuario, // () => void
  
  // Funciones de productos
  onAbrirFormularioProducto, // () => void
  onEditarProducto,      // (producto) => void
  onEliminarProducto,    // (id) => void
  onGuardarProducto,     // (e) => void
  onCancelarFormularioProducto, // () => void
  onCambioCampoFormulario, // (campo, valor) => void
  
  // Funciones de recomendaciones
  onAgregarRecomendacion,
  onEditarRecomendacion,
  onEliminarRecomendacion,
  
  // Funciones de pedidos
  onGuardarPedido,
  onEditarPedido,
  onEliminarPedido,
}
```

---

## Componentes Compartidos

### Menu.jsx
**Ubicación:** `src/Componentes/Shared/Menu/Menu.jsx`

Contenedor del navbar que maneja estados de modales:

```javascript
const Menu = () => {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  return (
    <>
      <NavBarPrincipal
        onAbrirLogin={() => setMostrarLogin(true)}
        onAbrirRegistro={() => setMostrarRegistro(true)}
      />
      <Login show={mostrarLogin} onHide={() => setMostrarLogin(false)} />
      <Registro show={mostrarRegistro} onHide={() => setMostrarRegistro(false)} />
    </>
  );
};
```

### NavBarPrincipal.jsx
**Ubicación:** `src/Componentes/Shared/Menu/NavBarPrincipal/NavBarPrincipal.jsx`

Barra de navegación con:
- Logo
- Selector de idioma (ES/EN)
- Botones Login/Registro (si no autenticado)
- MenuUsuario (si autenticado)
- Versión responsive para móvil

### MenuUsuario.jsx
**Ubicación:** `.../menuUsuario/MenuUsuario.jsx`

Dropdown con opciones del usuario logueado:
- Perfil
- Admin (si es admin)
- Cerrar sesión

### Footer.jsx
**Ubicación:** `src/Componentes/Shared/Footer/Footer.jsx`

Pie de página con links y redes sociales.

---

## Utilidades

### RutaProtegida.jsx
HOC que protege rutas de administrador:

```javascript
const RutaProtegida = ({ children }) => {
  const { usuarioActual, esAdministrador, cargando } = useUser();

  if (cargando) return <Spinner />;
  if (!usuarioActual || !esAdministrador) return <Navigate to="/" />;
  return children;
};

// Uso en App.jsx:
<Route
  path="/admin"
  element={
    <RutaProtegida>
      <AdminPanelContainer />
    </RutaProtegida>
  }
/>
```

### productoUtils.js
Funciones helper para productos:

```javascript
import { 
  crearProductoData,    // Normaliza objeto producto
  generarIdCarrito,     // Genera ID único
  validarStock,         // Verifica stock
  formatearPrecio,      // "450000" → "450.000"
  formatearKilometros,  // "12000" → "12.000 km"
  truncarTexto,         // Corta texto largo
  acortarUbicacion,     // Acorta ubicación
  PRODUCTO_DEFAULT,     // Valores por defecto
} from './Utils/productoUtils';
```

### ValidacionesForm.js
Schemas de Zod para validación:

```javascript
import { 
  registroSchema,       // Validación de registro
  loginSchema,          // Validación de login
  PAISES_VALIDOS,       // Array de países
  FECHA_MINIMA,         // Fecha mínima nacimiento
  FECHA_MAXIMA,         // Fecha máxima nacimiento
} from './Utils/ValidacionesForm';
```

### I18next.js
Configuración de internacionalización (ES/EN).

### inicializarLocalStorage.js
Inicializa localStorage con arrays vacíos si no existen.
