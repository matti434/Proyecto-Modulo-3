# 🏍️ Rolling Motors

**Tienda web de motos Royal Enfield** — E-commerce moderno con panel de administración, carrito, autenticación y diseño responsive.

---

## 📌 Descripción

**Rolling Motors** es una aplicación web de presentación y venta de productos relacionados con Royal Enfield. Incluye catálogo de productos por categorías y cilindrada, ofertas, carrito de compras, registro e inicio de sesión, contacto con formulario y mapa, y un **panel de administración** protegido para gestionar usuarios, productos, pedidos y recomendaciones.

El proyecto está construido con **React 19** y **Vite 7**, siguiendo una arquitectura **MVVM** en las zonas críticas (Admin, formularios de Login/Registro) y usando **Context API** para el estado global (usuario, productos, carrito).

---

## ✨ Características principales

| Área | Funcionalidad |
|------|----------------|
| **Inicio** | Portada, galería y categorías destacadas |
| **Productos** | Listado, filtros por categoría/cilindrada, buscador, detalle de producto |
| **Carrito** | Añadir/quitar productos, persistencia con Context |
| **Usuario** | Registro, login, perfil y menú de usuario |
| **Contacto** | Formulario de contacto (EmailJS) y mapa (Leaflet) |
| **Ofertas** | Sección de ofertas destacadas |
| **Admin** | Panel protegido: usuarios, suspendidos, productos, pedidos, recomendaciones, mapa de usuarios |
| **UX** | Internacionalización (i18n), toasts, animaciones (Framer Motion, AOS), diseño responsive (Bootstrap) |

---

## 🛠️ Stack tecnológico

- **Frontend:** React 19, React Router 7, Vite 7  
- **UI:** Bootstrap 5, React Bootstrap, Bootstrap Icons, Framer Motion, AOS  
- **Formularios:** React Hook Form, Zod (validación)  
- **Estado:** Context API (Usuario, Producto, Carrito)  
- **Arquitectura:** Patrón MVVM (ViewModels + Views + Containers)  
- **Mapas:** Leaflet, React Leaflet, Google Maps API  
- **Otros:** i18next (i18n), EmailJS, react-hot-toast  

---

## 📁 Estructura del proyecto (resumida)

```
rolling-motor/
├── src/
│   ├── Componentes/
│   │   ├── Admin/          # Panel admin (MVVM)
│   │   ├── Context/        # ContextoUsuario, ContextoProducto, ContextoCarrito
│   │   ├── Shared/         # Menu, Footer, NavBar, Perfil
│   │   ├── Utils/          # RutaProtegida, validaciones, i18n
│   │   └── Views/          # Home, Login, Registro, Productos, Carrito, Contacto, 404
│   ├── ViewModels/         # Lógica MVVM (Admin, Carrito, Productos, etc.)
│   ├── Services/           # productoService, usuarioService
│   ├── Models/             # Producto, Usuario, CarritoItem
│   └── estilos/            # variables CSS globales
├── public/                 # Imágenes, logo, galería
├── docs/                   # Documentación (MVVM, Context, variables CSS)
└── netlify.toml            # Configuración de despliegue
```

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos

- Node.js 20 (recomendado)
- npm

### Instalación

```bash
# Clonar el repositorio (o abrir la carpeta del proyecto)
cd rolling-motor

# Instalar dependencias
npm install

# (Opcional) Levantar API local con json-server para datos de prueba
npm run server
```

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run server` | JSON Server en puerto 3001 (datos mock) |
| `npm run lint` | Ejecutar ESLint |

### Desarrollo

```bash
npm run dev
```

Abre en el navegador la URL que indique Vite (normalmente `http://localhost:5173`).

---

## 🌐 Despliegue

El proyecto está preparado para **Netlify**:

- **Build:** `npm run build`
- **Directorio de publicación:** `dist`
- **Redirects:** SPA (todas las rutas a `index.html`)

Configuración en `netlify.toml`.

---

## 📚 Documentación adicional

En la carpeta `docs/` encontrarás:

- `ADMINPANEL_MVVM_COMPLETADO.md` — Detalle de la arquitectura MVVM del panel de administración  
- `CONTEXT_SERVICIOS.md` — Contextos (Usuario, Producto, Carrito) y servicios  
- `VARIABLES_CSS.md` — Variables CSS del proyecto  

---

## 👤 Presentación

Proyecto desarrollado como aplicación web full-stack frontend con:

- Arquitectura clara (MVVM + Context)
- Buenas prácticas (validación con Zod, rutas protegidas, hooks reutilizables)
- Experiencia de usuario cuidada (i18n, toasts, animaciones, responsive)
- Documentación interna para mantenimiento y ampliación

**Rolling Motors** — *Listo para demostrar en vivo.*
