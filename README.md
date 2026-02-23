# Rolling Motors – Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vitejs.dev/)

Frontend de la tienda **Rolling Motors**: catálogo de productos, carrito, favoritos, autenticación, panel de administración y contacto. Desarrollado con React y Vite.

**Demo:** [Ver en vivo](https://tu-demo.netlify.app) *(reemplaza por la URL de tu deploy en Netlify cuando esté publicado)*

---

## 📌 Información general

### Descripción

Aplicación web responsive para visualizar productos (motocicletas/accesorios), gestionar carrito y favoritos, iniciar sesión/registro, recuperar contraseña y acceder a un panel de administración. Incluye internacionalización (español/inglés) y conexión con backend REST.

### Stack utilizado

| Tecnología | Uso |
|------------|-----|
| **React** 19 | UI y componentes |
| **Vite** 7 | Build y dev server |
| **React Router** 7 | Rutas (SPA) |
| **Bootstrap 5** / **react-bootstrap** | Layout y componentes UI |
| **i18next** / **react-i18next** | Traducciones (ES/EN) |
| **Framer Motion** | Animaciones |
| **Lottie** | Animación de portada (Splash) |
| **React Hook Form** + **Zod** | Formularios y validación |
| **Leaflet** / **react-leaflet** | Mapas (ej. admin) |
| **SweetAlert2** | Diálogos de confirmación |
| **react-hot-toast** | Notificaciones |
| **EmailJS** | Envío de formulario de contacto |

### Rutas principales de la aplicación

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio |
| `/productos` | Catálogo de productos |
| `/productos-todos` | Todas las categorías |
| `/detalle-producto` | Detalle de producto (con query `?id=`) |
| `/ofertas` | Productos en oferta |
| `/carrito` | Carrito de compras |
| `/favoritos` | Lista de favoritos |
| `/login` | Iniciar sesión |
| `/registro` | Registro de usuario |
| `/recuperar-password` | Recuperar contraseña |
| `/contacto` | Formulario de contacto |
| `/nosotros` | Sobre nosotros |
| `/admin` | Panel de administración *(ruta protegida: requiere estar logueado)* |
| Cualquier otra | Página 404 |

> **Nota:** La ruta `/admin` solo es accesible con sesión iniciada. El backend debe estar en ejecución para que login y admin funcionen correctamente.

---

## ⚙️ Instalación

### Requisitos

- Node.js 18+ (recomendado 20+)
- npm (o yarn/pnpm)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/matti434/Proyecto-Modulo-3.git
cd Proyecto-Modulo-3

# Instalar dependencias
npm install

# Levantar en desarrollo
npm run dev
```

La app se abrirá en `http://localhost:5173` (o el puerto que indique Vite).

### Otros scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Ejecutar ESLint |
| `npm run server` | JSON Server en puerto 3001 (si se usa) |

### Variables de entorno necesarias

Puedes copiar el archivo `.env.example` a `.env` en la raíz del proyecto y rellenar los valores. Si no existe `.env.example`, crea un archivo `.env` junto a `package.json` con:

```env
# URL base del API (backend)
VITE_API_URL=http://localhost:5000/api
```

En desarrollo, si no defines `VITE_API_URL`, la app usa por defecto `http://localhost:5000/api`.  
Todas las variables que use el frontend en Vite deben tener el prefijo `VITE_`.

---

## 🧩 Estructura del proyecto

```
src/
├── Componentes/           # Componentes React
│   ├── Admin/             # Panel de administración (productos, usuarios, home, mapa)
│   ├── Context/           # Context API (Usuario, Carrito, Productos, Favoritos)
│   ├── Shared/            # Reutilizables: Menu, NavBar, Footer, SplashScreen
│   ├── Utils/             # Utilidades: I18next, validaciones, RutaProtegida
│   └── Views/             # Páginas/vistas
│       ├── Contacto/
│       ├── Favoritos/
│       ├── Home/
│       ├── Login/
│       ├── Nosotros/
│       ├── Pagina404/
│       ├── Productos/     # Listado, detalle, carrito, categorías, ofertas
│       ├── Registro/
│       └── ...
├── Models/                # Modelos de datos (Producto, CarritoItem, etc.)
├── Services/
│   ├── Api/               # Cliente HTTP y APIs (auth, productos, carrito, pedidos, home)
│   └── persistence/       # Persistencia local si aplica
├── ViewModels/            # Lógica de negocio por vista (admin, carrito, productos, etc.)
├── estilos/               # CSS global y variables (variables.css)
├── App.jsx
└── main.jsx
```

| Carpeta | Descripción |
|---------|-------------|
| **Componentes/Views** | Páginas por ruta: Home, Productos, Carrito, Login, Registro, Contacto, Admin, etc. |
| **Componentes/Shared** | Header, menú, footer, splash screen. |
| **Componentes/Context** | Estado global: usuario, carrito, productos, favoritos. |
| **Componentes/Admin** | Vistas y contenedores del panel de administración. |
| **Componentes/Utils** | Configuración i18n, validaciones, rutas protegidas. |
| **Services/Api** | `apiClient.js` y módulos por dominio: `authApi`, `productosApi`, `carritoApi`, `pedidosApi`, `homeApi`. |
| **ViewModels** | Hooks/vistas modelo para admin, carrito, productos, formularios. |
| **Models** | Definiciones de entidades (Producto, CarritoItem, etc.). |
| **estilos** | Variables CSS (colores, sombras) y estilos globales. |

---

## 🔌 Conexión con backend

El frontend consume una API REST. La URL base se configura con `VITE_API_URL`.

- **Cliente:** `src/Services/Api/apiClient.js` (usa `import.meta.env.VITE_API_URL`).
- **Endpoints usados:** `/auth/*`, `/productos/*`, `/carrito/*`, `/pedidos/*`, `/home/*`.
- **Ruta `/admin`:** Requiere autenticación; el backend debe estar en marcha y el usuario debe haber iniciado sesión.

### Ejemplo de `.env`

```env
# Desarrollo (backend en local)
VITE_API_URL=http://localhost:5000/api

# Producción (reemplazar por la URL real del backend)
# VITE_API_URL=https://tu-backend.herokuapp.com/api
```

Asegúrate de que el backend esté en marcha y que CORS permita el origen del frontend.

---

## 📱 Responsive

La interfaz está pensada para móvil y escritorio.

### Breakpoints principales

| Breakpoint | Uso típico |
|------------|------------|
| 320px | Móvil muy pequeño |
| 360px – 400px | Móvil pequeño |
| 480px | Móvil |
| 576px | Bootstrap `sm` |
| 768px | Tablet / Bootstrap `md` |
| 992px | Bootstrap `lg` |
| 1200px | Desktop / Bootstrap `xl` |

Los estilos usan `min-width` / `max-width` en distintos componentes (formularios, cards de producto, listas, navbar).  
Comportamiento: en móvil menú colapsable y contenido en columna; en desktop layout amplio y navegación completa.

---

## 🚀 Deploy

### Plataforma

El proyecto incluye `public/_redirects` compatible con **Netlify** (SPA: todas las rutas redirigen a `index.html`).

### Pasos recomendados

1. Conectar el repositorio con Netlify.
2. **Build command:** `npm run build`
3. **Publish directory:** `dist`
4. Añadir variable de entorno en Netlify:
   - **`VITE_API_URL`** = URL del API en producción (ej. `https://tu-api.com/api`)

Sin `VITE_API_URL` en producción, el frontend intentaría usar `http://localhost:5000/api`, lo que fallaría en el navegador del usuario.

---

## 🔧 Problemas frecuentes (Troubleshooting)

| Problema | Solución |
|----------|----------|
| **"No se puede conectar al servidor"** | Verifica que el backend esté en ejecución y que `VITE_API_URL` en tu `.env` apunte a la URL correcta (ej. `http://localhost:5000/api`). En producción, configura `VITE_API_URL` en Netlify. |
| **Error de CORS** | El backend debe permitir el origen del frontend: en desarrollo `http://localhost:5173`, en producción la URL de tu sitio en Netlify. Revisa la configuración CORS del servidor. |
| **Puerto 5173 en uso** | Vite usará otro puerto automáticamente; revisa en la terminal qué puerto indica (ej. 5174). |
| **No puedo entrar a `/admin`** | La ruta está protegida: debes iniciar sesión primero. Asegúrate de que el backend esté corriendo y de tener un usuario con permisos de admin si aplica. |
| **Las variables de `.env` no se aplican** | Reinicia el servidor de desarrollo (`npm run dev`) después de cambiar `.env`. Las variables deben tener el prefijo `VITE_`. |

---

## 🧪 Traducciones (i18n)

El proyecto usa **i18next** con idiomas **español (es)** e **inglés (en)**. Las cadenas se definen en `src/Componentes/Utils/I18next.js`.

### Glosario de términos del proyecto (ES → EN)

| Español | English |
|---------|---------|
| Iniciar sesión | Login |
| Registrarse | Register |
| Perfil | Profile |
| Contacto | Contact |
| Soporte | Support |
| Cerrar sesión | Logout |
| Inicio | Home |
| Productos | Products |
| Cambiar idioma | Change language |
| Carrito de compras | Shopping Cart |
| Menú de usuario | User Menu |
| Tu camino continúa en Rolling Motors | Your journey continues at Rolling Motors |
| Ingresa tus credenciales para acceder a tu cuenta | Enter your credentials to access your account |
| Usuario o email | Username or email |
| Contraseña | Password |
| ¿Olvidaste tu contraseña? | Forgot your password? |
| Cancelar | Cancel |
| Iniciando sesión... | Logging in... |
| Crear nueva cuenta | Create new account |
| ¿No tienes una cuenta? | Don't have an account? |
| Registrarse aquí | Register here |
| Ya tengo cuenta | Already have an account? |
| Mostrar contraseña | Show password |
| Ocultar contraseña | Hide password |
| Cerrar | Close |
| Credenciales incorrectas. Por favor verifica tus datos. | Incorrect credentials. Please verify your data. |
| Registro | Register |
| Completa todos los campos para crear tu cuenta | Complete all fields to create your account |
| Nombre de usuario | Username |
| Email | Email |
| País de residencia | Country of residence |
| Fecha de nacimiento | Date of birth |
| Confirmar contraseña | Confirm password |
| Las contraseñas no coinciden | Passwords do not match |

El idioma por defecto es `es`; el de respaldo también es `es`.

---

## 🧩 Componentes y repositorios

| Recurso | Descripción |
|---------|-------------|
| **Repositorio Frontend** | [Proyecto-Modulo-3](https://github.com/matti434/Proyecto-Modulo-3) |
| **Repositorio Backend** | [Proyecto-Modulo-3-Back](https://github.com/matti434/Proyecto-Modulo-3-Back) |
| **Archivo .env.example** | En la raíz del repo; copiar a `.env` y definir `VITE_API_URL` (sin valores sensibles). |
---

## 🚨 Objetivo del proyecto

Este README deja el proyecto documentado y listo para:

- **Entrega académica o profesional**
- **Onboarding de nuevos desarrolladores**
- **Deploy y mantenimiento futuro**
- **Presentación como proyecto de portfolio**

---

## 👤 Autor

**Rolling Motors** – Proyecto Módulo 3  

- Repositorio: [GitHub – Proyecto-Modulo-3](https://github.com/matti434/Proyecto-Modulo-3)
- Backend: [GitHub – Proyecto-Modulo-3-Back](https://github.com/matti434/Proyecto-Modulo-3-Back)

---

## Licencia

Este proyecto está bajo la Licencia MIT.

Copyright (c) 2026 Rolling Motors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.