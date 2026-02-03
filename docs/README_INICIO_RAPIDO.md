# Rolling Motor - Guía de Inicio Rápido

## Índice
1. [Requisitos](#requisitos)
2. [Instalación](#instalación)
3. [Scripts Disponibles](#scripts-disponibles)
4. [Crear Usuario Admin](#crear-usuario-admin)
5. [Estructura de LocalStorage](#estructura-de-localstorage)
6. [Rutas de la Aplicación](#rutas-de-la-aplicación)
7. [Flujo de Trabajo para Cambios](#flujo-de-trabajo-para-cambios)
8. [Convenciones del Proyecto](#convenciones-del-proyecto)
9. [Troubleshooting](#troubleshooting)

---

## Requisitos

- **Node.js** 18 o superior
- **npm** 9 o superior

Verificar versiones:
```bash
node --version  # v18.x.x o superior
npm --version   # 9.x.x o superior
```

---

## Instalación

```bash
# 1. Clonar repositorio
git clone <url-del-repo>
cd rolling-motor

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo con hot reload |
| `npm run build` | Genera build de producción en `/dist` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Ejecuta ESLint para verificar código |

---

## Crear Usuario Admin

La aplicación usa `role: "admin"` para dar acceso al panel de administración.

### Opción 1: Editar manualmente localStorage

1. Registra un usuario normal desde la app (botón "Registrarse")
2. Abre DevTools (F12) → Application → Local Storage → http://localhost:5173
3. Busca la clave `usuarios`
4. Edita el JSON cambiando `"role": "usuario"` a `"role": "admin"`
5. Recarga la página (F5)

### Opción 2: Usar la consola del navegador

```javascript
// Ejecutar en la consola del navegador (F12 → Console)
const usuarios = JSON.parse(localStorage.getItem('usuarios'));
if (usuarios.length > 0) {
  usuarios[0].role = 'admin';  // Convierte el primer usuario en admin
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  console.log('Usuario convertido a admin. Recarga la página.');
}
location.reload();
```

### Opción 3: Crear usuario admin directamente

```javascript
// Ejecutar en consola - crea un admin directamente
const adminUser = {
  id: crypto.randomUUID(),
  nombreDeUsuario: "admin",
  email: "admin@rollingmotor.com",
  pais: "Argentina",
  fechaNacimiento: "1990-01-01",
  contrasena: "Admin123!",  // Cumple requisitos de validación
  role: "admin"
};

const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
usuarios.push(adminUser);
localStorage.setItem('usuarios', JSON.stringify(usuarios));
console.log('Admin creado. Credenciales: admin@rollingmotor.com / Admin123!');
location.reload();
```

---

## Estructura de LocalStorage

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `usuarios` | Array | Usuarios activos registrados |
| `usuariosSuspendidos` | Array | Usuarios suspendidos por admin |
| `productos` | Array | Catálogo de productos/motos |
| `carritoMotos` | Array | Items en el carrito del usuario |
| `ultimoUsuario` | Object | Usuario con sesión activa (persistencia de login) |

### Estructura de un Usuario
```json
{
  "id": "uuid-generado",
  "nombreDeUsuario": "juanperez",
  "email": "juan@email.com",
  "pais": "Argentina",
  "fechaNacimiento": "1990-05-15",
  "contrasena": "MiPass123!",
  "role": "usuario"
}
```

### Estructura de un Producto
```json
{
  "id": "uuid-generado",
  "nombre": "Royal Enfield Classic 350",
  "marca": "Royal Enfield",
  "modelo": "Classic 350",
  "año": "2024",
  "precio": "450000",
  "categoria": "350cc",
  "descripcion": "Moto clásica en excelente estado",
  "imagen": "/Productos/imgCard.jpg",
  "kilometros": "12000",
  "ubicacion": "Buenos Aires, AR",
  "stock": true,
  "destacado": false,
  "fechaCreacion": "2024-01-15T10:30:00.000Z"
}
```

---

## Rutas de la Aplicación

| Ruta | Componente | Acceso | Descripción |
|------|------------|--------|-------------|
| `/` | Home | Público | Página principal con portada y galería |
| `/productos` | PaginaProductos | Público | Listado con filtros y búsqueda |
| `/productos-todos` | Categorias | Público | Grid de categorías |
| `/detalle-producto` | DetalleProducto | Público | Detalle de un producto (recibe state) |
| `/carrito` | CarritoContainer | Público | Carrito de compras |
| `/ofertas` | Ofertas | Público | Productos en oferta |
| `/contacto` | Contacto | Público | Formulario de contacto |
| `/admin` | AdminPanelContainer | **Solo Admin** | Panel de administración |
| `*` | Pagina404 | Público | Página no encontrada |

---

## Flujo de Trabajo para Cambios

### Identificar el tipo de componente

Antes de modificar, identifica si el componente usa **MVVM**:

| Patrón | Archivos | Dónde va la lógica |
|--------|----------|-------------------|
| **MVVM** | `*Container.jsx` + `*View.jsx` + `use*ViewModel.js` | ViewModel |
| **Simple** | Solo `*.jsx` | Mismo archivo |

### Modificar componente MVVM

```
Ejemplo: AdminPanel

1. Lógica (estados, handlers) → useAdminViewModel.js
2. UI (JSX) → AdminPanelView.jsx
3. Conexión → AdminPanelContainer.jsx (no tocar)
```

### Agregar una nueva página

1. Crear carpeta: `src/Componentes/Views/NuevaPagina/`
2. Crear archivos:
   - `NuevaPagina.jsx`
   - `NuevaPagina.css`
3. Agregar ruta en `App.jsx`:
   ```jsx
   import NuevaPagina from './Componentes/Views/NuevaPagina/NuevaPagina';
   
   // En <Routes>
   <Route path="/nueva-pagina" element={<NuevaPagina />} />
   ```

### Agregar validación de formulario

1. Crear schema en `src/Componentes/Utils/ValidacionesForm.js`:
   ```javascript
   export const miNuevoSchema = z.object({
     campo: z.string().min(1, "Campo requerido"),
   });
   ```

2. Usar en el componente:
   ```javascript
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { miNuevoSchema } from '../../Utils/ValidacionesForm';

   const { register, handleSubmit, formState: { errors } } = useForm({
     resolver: zodResolver(miNuevoSchema),
     mode: "onChange"
   });
   ```

### Agregar nuevo servicio de datos

1. Crear persistence: `src/Services/persistence/nuevoItemPersistence.js`
2. Crear service: `src/Services/nuevoItemService.js`
3. (Opcional) Crear model: `src/Models/NuevoItem.js`
4. Crear context: `src/Componentes/Context/ContextoNuevoItem.jsx`
5. Agregar provider en `App.jsx`

---

## Convenciones del Proyecto

### Nomenclatura de archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componente | PascalCase | `CardProducto.jsx` |
| Hook | camelCase con `use` | `useAdminViewModel.js` |
| Servicio | camelCase con `Service` | `usuarioService.js` |
| Persistence | camelCase con `Persistence` | `usuarioPersistence.js` |
| CSS | Mismo nombre que componente | `CardProducto.css` |
| Utilidades | camelCase | `productoUtils.js` |

### Estructura de un componente MVVM

```javascript
// useEjemploViewModel.js
export const useEjemploViewModel = () => {
  const [estado, setEstado] = useState();
  const accion = useCallback(() => {}, []);
  return { estado, onAccion: accion };
};

// EjemploView.jsx
const EjemploView = ({ estado, onAccion }) => {
  return <div onClick={onAccion}>{estado}</div>;
};

// EjemploContainer.jsx
const EjemploContainer = () => {
  const vm = useEjemploViewModel();
  return <EjemploView {...vm} />;
};
```

### Importaciones

```javascript
// Orden recomendado de imports
// 1. React y hooks
import { useState, useEffect } from 'react';

// 2. Librerías externas
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

// 3. Contextos
import { useUser } from '../Context/ContextoUsuario';

// 4. Services/Utils
import { usuarioService } from '../../Services/usuarioService';

// 5. Componentes locales
import CardProducto from './CardProducto';

// 6. Estilos
import './MiComponente.css';
```

---

## Troubleshooting

### Error: "No se puede conectar al servidor"
- Verifica que `npm run dev` esté corriendo
- Puerto por defecto: 5173

### Los cambios no se reflejan
- Limpia localStorage: DevTools → Application → Clear site data
- O ejecuta en consola: `localStorage.clear(); location.reload();`

### Error de CORS con EmailJS
- El formulario de contacto usa EmailJS que requiere conexión a internet
- Las credenciales están en `Contacto.jsx`

### El usuario no aparece como admin
- Verifica que `role: "admin"` esté correcto en localStorage
- El usuario debe cerrar sesión y volver a entrar

### Error "useContext must be used within a Provider"
- Verifica que el componente esté dentro del Provider correcto en `App.jsx`
- Orden de providers:
  ```jsx
  <CarritoProvider>
    <ProveedorProductos>
      <UserProvider>
        {/* componentes */}
      </UserProvider>
    </ProveedorProductos>
  </CarritoProvider>
  ```

---

## Variables de Entorno

El proyecto no requiere variables de entorno. Todo funciona con localStorage.

Para EmailJS (formulario de contacto), las credenciales están en el código:
- Archivo: `src/Componentes/Views/Contacto/Contacto.jsx`
- Buscar: `emailjs.sendForm(...)`

---

## Tareas Pendientes

Ver documentación completa en: `docs/TAREAS_PENDIENTES_ACTUALIZADO.md`

Resumen rápido:
- [ ] Reemplazar `alert()` por `toast` (14 instancias)
- [ ] Reemplazar `window.confirm()` por modales (4 instancias)
- [ ] Mejorar manejo de errores en Contacto
- [ ] Reemplazar colores hardcodeados por variables CSS

---

## Documentación Adicional

| Documento | Contenido |
|-----------|-----------|
| `README_ARQUITECTURA.md` | Estructura, MVVM, flujo de datos |
| `README_COMPONENTES.md` | Detalles de cada componente y contexto |
| `README_SERVICIOS.md` | Services, Persistence, Models |
| `TAREAS_PENDIENTES_ACTUALIZADO.md` | Lista de mejoras pendientes |
