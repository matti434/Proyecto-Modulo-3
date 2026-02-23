# API Pedidos – Descripción para el Backend (Cursor)

El frontend crea **pedidos desde el panel de administración** (no hay checkout finalizado). El backend debe exponer los siguientes endpoints y comportamientos.

---

## Base URL

- API: `VITE_API_URL` (ej. `http://localhost:5000/api`). El cliente usa `apiClient` con `fetchApi(endpoint, options)` y envía `Content-Type: application/json`; las credenciales se envían con `credentials: 'include'` (cookies). Si el backend usa JWT en header, el front puede extenderse para enviar `Authorization: Bearer <token>`; por ahora el cliente no lo envía en `apiClient`.

---

## Endpoints requeridos

### 1. `POST /api/pedidos` – Crear pedido (admin)

**Descripción:** Crear un pedido desde el panel de administración. Solo administradores pueden crear.

**Body (JSON):**

| Campo        | Tipo   | Obligatorio | Validación (front) | Descripción        |
|-------------|--------|-------------|--------------------|--------------------|
| `titulo`    | string | Sí          | 1–30 caracteres   | Título del pedido  |
| `descripcion` | string | Sí        | 1–150 caracteres  | Descripción        |
| `fecha`     | string | Sí          | YYYY-MM-DD, entre 1930 y 2025 | Fecha del pedido/entrega |

**Ejemplo:**

```json
{
  "titulo": "Pedido repuestos",
  "descripcion": "Repuestos para moto modelo X.",
  "fecha": "2025-02-20"
}
```

**Respuesta esperada (200):**

- Objeto del pedido creado, con al menos: `_id` o `id`, y los campos enviados (`titulo`, `descripcion`, `fecha`). Opcional: `estado` (por defecto `"pendiente"`), `createdAt`, `usuario` (null si lo crea el admin).

**Errores:**

- 400: validación fallida (mensaje en `mensaje` o equivalente).
- 401/403: no autorizado (solo admin).

---

### 2. `GET /api/pedidos?todos=true` – Listar todos los pedidos

**Descripción:** El admin usa `pedidosApi.obtenerTodos()` que llama a `GET /pedidos?todos=true`. Debe devolver un array de pedidos.

**Respuesta esperada (200):**

- Array de objetos pedido. Cada uno debe tener al menos:
  - `_id` o `id`
  - `titulo` (opcional si el pedido viene del carrito; en ese caso el front usa `usuario` como título)
  - `descripcion` (opcional)
  - `fecha` (opcional; el front muestra `fecha || createdAt`)
  - `estado` (ej. `"pendiente"`, `"procesando"`, `"enviado"`, `"entregado"`, `"cancelado"`)
  - `usuario` (objeto o id, opcional; para pedidos de checkout)
  - `total` (opcional; para pedidos de carrito)
  - `createdAt` (opcional)

---

### 3. `PUT /api/pedidos/:id/estado` – Actualizar estado

**Descripción:** El front llama `pedidosApi.actualizarEstado(id, estado)`.

**Body (JSON):**

```json
{ "estado": "procesando" }
```

Valores de `estado` usados en el front: `"pendiente"`, `"procesando"`, `"enviado"`, `"entregado"`, `"cancelado"`.

**Respuesta esperada (200):** Objeto del pedido actualizado o `{ ok: true }`.

**Errores:** 400 (estado inválido), 404 (pedido no encontrado), 401/403.

---

## Resumen de validaciones (frontend)

- **titulo:** obligatorio, máximo 30 caracteres.
- **descripcion:** obligatoria, máximo 150 caracteres.
- **fecha:** obligatoria, formato `YYYY-MM-DD`, entre **1930-01-01** y **2025-12-31**.

El backend debería aplicar las mismas reglas (o más restrictivas) en `POST /pedidos` y devolver mensajes claros en `mensaje` cuando falle la validación.

---

## Notas

- Los pedidos creados por el admin pueden tener `usuario: null` y `total: null`; el listado del front los muestra correctamente.
- El front no envía token en `apiClient` por defecto; si el backend exige JWT, habrá que añadir el header `Authorization` en las peticiones de pedidos (o usar cookies de sesión).
