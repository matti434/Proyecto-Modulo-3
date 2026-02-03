# Rolling Motor - Documentación de Arquitectura

## Índice
1. [Visión General](#visión-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura de Carpetas](#estructura-de-carpetas)
4. [Patrón de Arquitectura (MVVM)](#patrón-de-arquitectura-mvvm)
5. [Flujo de Datos](#flujo-de-datos)

---

## Visión General

Rolling Motor es una aplicación web de e-commerce para la venta de motos Royal Enfield. Está construida con React 19 y utiliza el patrón **MVVM (Model-View-ViewModel)** para separar la lógica de negocio de la UI.

### Características Principales
- Catálogo de productos con filtros y búsqueda
- Carrito de compras persistente
- Sistema de autenticación (login/registro)
- Panel de administración (solo admins)
- Internacionalización (ES/EN)
- Persistencia en LocalStorage

---

## Tecnologías Utilizadas

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Core** | React 19.2 | Framework principal |
| **Routing** | react-router-dom 7.9 | Navegación SPA |
| **UI** | Bootstrap 5.3 + react-bootstrap | Componentes UI |
| **Formularios** | react-hook-form + Zod | Validación de formularios |
| **Estado** | React Context API | Manejo de estado global |
| **Notificaciones** | react-hot-toast | Toasts/alertas |
| **i18n** | i18next + react-i18next | Internacionalización |
| **Mapas** | Leaflet + react-leaflet | Mapa de usuarios |
| **Animaciones** | framer-motion + AOS | Animaciones |
| **Iconos** | react-icons + bootstrap-icons | Iconografía |
| **Build** | Vite 7.2 | Bundler/dev server |
| **Email** | @emailjs/browser | Envío de emails (Contacto) |

---

## Estructura de Carpetas

```
src/
├── main.jsx                    # Punto de entrada
├── App.jsx                     # Rutas y providers
├── App.css                     # Estilos globales
│
├── Models/                     # 📦 MODELOS DE DATOS
│   ├── Usuario.js              # Clase Usuario
│   ├── Producto.js             # Clase Producto
│   ├── CarritoItem.js          # Clase item carrito
│   └── index.js                # Exports
│
├── Services/                   # 🔧 CAPA DE SERVICIOS
│   ├── usuarioService.js       # Lógica de negocio usuarios
│   ├── productoService.js      # Lógica de negocio productos
│   └── persistence/            # 💾 CAPA DE PERSISTENCIA
│       ├── usuarioPersistence.js
│       └── productoPersistence.js
│
├── ViewModels/                 # 🧠 VIEWMODELS
│   ├── useAdminViewModel.js    # VM del panel admin
│   ├── useProductosViewModel.js # VM de productos
│   ├── useCarritoViewModel.js  # VM del carrito
│   └── index.js
│
├── Componentes/
│   ├── Context/                # 🌐 CONTEXTOS GLOBALES
│   │   ├── ContextoUsuario.jsx # Estado de usuarios
│   │   ├── ContextoProducto.jsx # Estado de productos
│   │   ├── ContextoCarrito.jsx # Estado del carrito
│   │   └── hooks/              # Hooks extraídos
│   │       ├── useAuth.js
│   │       ├── useUsuarioData.js
│   │       └── useUsuariosManagement.js
│   │
│   ├── Admin/                  # 👑 PANEL ADMIN
│   │   ├── AdminPanelContainer.jsx  # Container (conecta VM)
│   │   ├── AdminPanelView.jsx       # Vista principal
│   │   ├── AdminUsuariosView.jsx    # Vista usuarios
│   │   ├── AdminProductosView.jsx   # Vista productos
│   │   ├── AdminSuspendidosView.jsx # Vista suspendidos
│   │   └── ...otros
│   │
│   ├── Shared/                 # 🔄 COMPONENTES COMPARTIDOS
│   │   ├── Menu/               # Barra de navegación
│   │   └── Footer/             # Pie de página
│   │
│   ├── Utils/                  # 🛠️ UTILIDADES
│   │   ├── ValidacionesForm.js # Schemas Zod
│   │   ├── RutaProtegida.jsx   # HOC para rutas admin
│   │   ├── productoUtils.js    # Helpers productos
│   │   ├── I18next.js          # Config i18n
│   │   └── inicializarLocalStorage.js
│   │
│   └── Views/                  # 📄 VISTAS/PÁGINAS
│       ├── Home/
│       ├── Login/
│       ├── Registro/
│       ├── Productos/
│       ├── Contacto/
│       └── ...
│
└── estilos/                    # 🎨 ESTILOS GLOBALES
    ├── variables.css           # Variables CSS
    └── forms.css               # Estilos formularios
```

---

## Patrón de Arquitectura (MVVM)

El proyecto sigue **MVVM (Model-View-ViewModel)**:

```
┌─────────────────────────────────────────────────────────────┐
│                         VISTA (View)                        │
│  Componentes React puros, solo renderizado                  │
│  Ejemplo: AdminPanelView.jsx, FormLoginView.jsx            │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                    CONTAINER (Conecta VM)                   │
│  Conecta ViewModel con Vista                                │
│  Ejemplo: AdminPanelContainer.jsx                          │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                    VIEWMODEL (Lógica UI)                    │
│  Hooks con useState, useCallback, useMemo                   │
│  Ejemplo: useAdminViewModel.js, useFormLoginViewModel.js   │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                   CONTEXTOS (Estado Global)                 │
│  Proveen datos y acciones a toda la app                     │
│  ContextoUsuario, ContextoProducto, ContextoCarrito        │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                  SERVICE (Lógica de Negocio)                │
│  Validaciones, transformaciones, reglas de negocio          │
│  usuarioService.js, productoService.js                     │
└─────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────┐
│                 PERSISTENCE (Capa de Datos)                 │
│  Solo operaciones CRUD en LocalStorage                      │
│  usuarioPersistence.js, productoPersistence.js             │
└─────────────────────────────────────────────────────────────┘
```

### Ejemplo Práctico: Admin Panel

```javascript
// 1. CONTAINER - AdminPanelContainer.jsx
const AdminPanelContainer = () => {
  const viewModel = useAdminViewModel();  // Obtiene lógica
  return <AdminPanelView {...viewModel} />; // Pasa a vista
};

// 2. VIEWMODEL - useAdminViewModel.js
export const useAdminViewModel = () => {
  const { usuarios } = useUser();  // Del contexto
  const [vistaActiva, setVistaActiva] = useState("usuarios");
  // ... toda la lógica
  return { usuarios, vistaActiva, onCambiarVista: setVistaActiva };
};

// 3. VIEW - AdminPanelView.jsx
const AdminPanelView = ({ usuarios, vistaActiva, onCambiarVista }) => {
  // Solo JSX, sin useState ni lógica
  return <div>...</div>;
};
```

---

## Flujo de Datos

### Lectura de Datos
```
Componente → useContext() → Context → Service → Persistence → LocalStorage
```

### Escritura de Datos
```
Usuario clickea → ViewModel.action() → Context.action() → Service → Persistence → LocalStorage
```

### Ejemplo: Login

```
1. Usuario ingresa credenciales en FormLoginView
2. handleSubmit() llama a useFormLoginViewModel.procesarEnvio()
3. procesarEnvio() llama a context.login()
4. useAuth.login() llama a usuarioService.login()
5. usuarioService valida y llama a persistence.obtenerTodos()
6. persistence lee de localStorage
7. Si éxito: setUsuarioActual() actualiza estado global
8. Toast muestra "Bienvenido"
```

---

## Providers en App.jsx

El orden de los providers es importante:

```jsx
<CarritoProvider>        {/* Nivel más externo */}
  <ProveedorProductos>   {/* Productos disponibles para carrito */}
    <UserProvider>       {/* Usuario disponible para todo */}
      <BrowserRouter>
        {/* Rutas */}
      </BrowserRouter>
    </UserProvider>
  </ProveedorProductos>
</CarritoProvider>
```

---

## Inicialización de la App

En `main.jsx`:

```javascript
// 1. Inicializa LocalStorage si está vacío
inicializarLocalStorage();

// 2. Configura Toaster para notificaciones
<Toaster position="top-right" ... />

// 3. Renderiza App
<App />
```
