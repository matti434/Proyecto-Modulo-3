# Tareas Pendientes - Rolling Motor (Actualizado)

**Última actualización:** Enero 2026

Este documento refleja el estado actual de las tareas después de la última sesión de trabajo.

---

## Resumen de Progreso

### Tareas Completadas en esta sesión

| # | Tarea | Archivos creados/modificados |
|---|-------|------------------------------|
| 1.1 | Consolidar Services y Servicios | `Services/persistence/`, eliminada carpeta `Servicios/` |
| 8 | Extraer código duplicado de productos | `src/Componentes/Utils/productoUtils.js` |
| 9 | Mover lógica de filtrado al ViewModel | `useProductosViewModel.js`, `ContextoProducto.jsx` |
| 10 | Unificar estilos de formularios | `src/estilos/forms.css` |

---

## Tareas Pendientes

### Alta Prioridad

#### 1. Reemplazar `alert()` por `toast`

**Total:** 18 instancias en 5 archivos

| Archivo | Líneas |
|---------|--------|
| `src/ViewModels/useCarritoViewModel.js` | 80, 83 |
| `src/ViewModels/useAdminViewModel.js` | 150, 163, 165, 221, 224, 229, 232, 236 |
| `src/Componentes/Views/Productos/componenteCarrito/Carrito.jsx` | 60, 63, 68 |
| `src/Componentes/Views/Productos/ComponenteProducto/PaginaProductos/card-Producto/CardProducto.jsx` | Ya corregido ✅ |
| `src/Componentes/Views/Productos/ComponenteProducto/PaginaProductos/Detalle-Producto/DetalleProducto.jsx` | Ya corregido ✅ |

**Acción:** Reemplazar `alert()` por `toast.success()` o `toast.error()` de `react-hot-toast`

---

#### 2. Reemplazar `window.confirm()` por Modal

**Total:** 4 instancias

| Archivo | Línea |
|---------|-------|
| `src/Componentes/Context/hooks/useUsuariosManagement.js` | 50 |
| `src/ViewModels/useCarritoViewModel.js` | 68 |
| `src/ViewModels/useAdminViewModel.js` | 160 |
| `src/Componentes/Views/Productos/componenteCarrito/Carrito.jsx` | 48 |

**Acción:** Crear `ModalConfirmacion.jsx` y usarlo en lugar de `window.confirm()`

---

#### 3. Mover lógica de ModalEditarUsuarioView al ViewModel

**Archivo:** `src/Componentes/Admin/ModalEditarUsuarioView.jsx`

**Problema:** Usa `useState` y `useEffect` cuando debería ser View pura

**Acción:** Mover estado a `useAdminViewModel.js`

---

#### 4. Mejorar manejo de errores en Contacto

**Archivo:** `src/Componentes/Views/Contacto/Contacto.jsx`

**Acción:** Cambiar `.catch(console.error)` por `.catch()` con toast.error()

---

### Media Prioridad (Excluidas por solicitud del usuario)

Las siguientes tareas fueron excluidas de esta sesión:

- ~~6. Completar migración MVVM en ListaProductos~~
- ~~7. Dividir useAdminViewModel en hooks más pequeños~~
- ~~11. Agregar validaciones con Zod en Admin~~

---

### Baja Prioridad

#### 12. Reemplazar colores hardcodeados por variables CSS

**Total:** 164 colores en 24 archivos CSS

**Archivos más afectados:**
- `AdminPanel.css` (15 colores)
- `Contacto.css` (14 colores)
- `Footer.css` (13 colores)

---

#### 13. Estandarizar breakpoints CSS

**Acción:** Definir breakpoints estándar en `variables.css`

---

#### 14. Agregar PropTypes (Excluida por solicitud del usuario)

---

#### 15. Dividir AdminPanel.css en módulos

**Archivo:** `src/Componentes/Admin/AdminPanel.css` (1165+ líneas)

---

## Archivos Creados en esta Sesión

```
src/
├── Componentes/
│   └── Utils/
│       └── productoUtils.js        ← NUEVO: Utilidades de productos
├── estilos/
│   └── forms.css                   ← NUEVO: Estilos compartidos de formularios
├── Services/
│   └── persistence/
│       ├── usuarioPersistence.js   ← NUEVO: Capa de persistencia usuarios
│       └── productoPersistence.js  ← NUEVO: Capa de persistencia productos
└── ViewModels/
    └── useProductosViewModel.js    ← MODIFICADO: Ahora incluye lógica de filtrado
```

---

## Archivos Eliminados

```
src/
└── Servicios/
    └── serviciosGenerales.js       ← ELIMINADO: Consolidado en Services/
```

---

## Cambios Importantes en Arquitectura

### 1. Nueva capa de persistencia

```
Componente/ViewModel
       ↓
    Service (lógica de negocio)
       ↓
    Persistence (localStorage)
```

Esto facilita la futura migración a una API/base de datos.

### 2. Lógica de filtrado movida al ViewModel

El filtrado de productos ahora se ejecuta en `useProductosViewModel.js`, aunque el contexto mantiene `productosFiltrados` por compatibilidad.

### 3. Estilos de formularios unificados

`forms.css` contiene todos los estilos compartidos de formularios. Los archivos específicos solo importan este archivo base.

---

## Comandos de Verificación

```bash
# Verificar que no hay alert()
Select-String -Path "src\**\*.js","src\**\*.jsx" -Pattern "alert\(" -Recurse

# Verificar que no hay window.confirm
Select-String -Path "src\**\*.js","src\**\*.jsx" -Pattern "window.confirm" -Recurse

# Verificar colores hardcodeados
Select-String -Path "src\**\*.css" -Pattern "#[0-9a-fA-F]{3,6}" -Recurse
```

---

## Notas para el Próximo Desarrollador

1. **CardProducto y DetalleProducto** ya usan `toast` en lugar de `alert()` - verificar que funciona correctamente
2. Los archivos CSS de formularios ahora importan `forms.css` - si se agregan estilos, hacerlo en el archivo compartido
3. La función `filtrarProductos` está exportada desde `ContextoProducto.jsx` para uso en otros ViewModels si es necesario
4. `productoUtils.js` contiene funciones de utilidad que pueden usarse en cualquier componente relacionado con productos
