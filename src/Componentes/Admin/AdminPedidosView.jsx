import { LIMITES } from "../Utils/ValidacionesForm";

const ESTADOS_PEDIDO = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];
const { titulo: MAX_TITULO, descripcion: MAX_DESC } = LIMITES.pedido;

/**
 * Vista de pedidos: formulario para crear (admin) y listado con cambio de estado.
 */
export const AdminPedidosView = ({
  pedidos,
  pedidosCargando = false,
  pedidoActual = {},
  erroresPedido = {},
  mostrarFormPedido = false,
  enviandoPedido = false,
  onActualizarEstadoPedido,
  onPedidoCampoChange,
  onGuardarPedido,
  onAbrirFormPedido,
  onCerrarFormPedido,
}) => {
  const formatFecha = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-AR", { dateStyle: "short" });
  };

  const usuarioLabel = (pedido) => {
    const u = pedido.usuario;
    if (!u) return "-";
    if (typeof u === "object") return u.nombreDeUsuario || u.email || u._id || "-";
    return String(u);
  };

  const tituloPedido = (p) => p.titulo ?? usuarioLabel(p) ?? "-";

  if (pedidosCargando) {
    return (
      <div className="contenedor-tabla">
        <h2>Gestión de Pedidos</h2>
        <p className="cargando">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="contenedor-tabla">
      <h2>Gestión de Pedidos</h2>
      <p className="texto-ayuda mb-3">
        Creá pedidos desde acá (sin checkout). Título máx. {MAX_TITULO} caracteres, descripción máx. {MAX_DESC}, fecha entre 1930 y 2025.
      </p>

      {!mostrarFormPedido ? (
        <button type="button" className="boton-agregar mb-3" onClick={onAbrirFormPedido}>
          ➕ Agregar pedido
        </button>
      ) : (
        <section className="formulario-pedido-admin mb-4">
          <h3 className="mb-3">Nuevo pedido</h3>
          <div className="formulario-pedido-campos">
            <div className="campo-form-pedido">
              <label htmlFor="pedido-titulo">Título (máx. {MAX_TITULO})</label>
              <input
                id="pedido-titulo"
                type="text"
                className={erroresPedido.titulo ? "input-error" : ""}
                value={pedidoActual.titulo ?? ""}
                onChange={(e) => onPedidoCampoChange?.("titulo", e.target.value)}
                maxLength={MAX_TITULO}
                placeholder="Ej: Pedido repuestos"
                aria-invalid={!!erroresPedido.titulo}
                aria-describedby={erroresPedido.titulo ? "error-titulo" : undefined}
              />
              {erroresPedido.titulo && (
                <span id="error-titulo" className="mensaje-error-formulario" role="alert">
                  {erroresPedido.titulo}
                </span>
              )}
            </div>
            <div className="campo-form-pedido">
              <label htmlFor="pedido-descripcion">Descripción (máx. {MAX_DESC})</label>
              <textarea
                id="pedido-descripcion"
                className={erroresPedido.descripcion ? "input-error" : ""}
                value={pedidoActual.descripcion ?? ""}
                onChange={(e) => onPedidoCampoChange?.("descripcion", e.target.value)}
                maxLength={MAX_DESC}
                rows={3}
                placeholder="Descripción del pedido"
                aria-invalid={!!erroresPedido.descripcion}
                aria-describedby={erroresPedido.descripcion ? "error-descripcion" : undefined}
              />
              {erroresPedido.descripcion && (
                <span id="error-descripcion" className="mensaje-error-formulario" role="alert">
                  {erroresPedido.descripcion}
                </span>
              )}
            </div>
            <div className="campo-form-pedido">
              <label htmlFor="pedido-fecha">Fecha (1930–2025)</label>
              <input
                id="pedido-fecha"
                type="date"
                className={erroresPedido.fecha ? "input-error" : ""}
                value={pedidoActual.fecha ?? ""}
                onChange={(e) => onPedidoCampoChange?.("fecha", e.target.value)}
                min="1930-01-01"
                max="2025-12-31"
                aria-invalid={!!erroresPedido.fecha}
                aria-describedby={erroresPedido.fecha ? "error-fecha" : undefined}
              />
              {erroresPedido.fecha && (
                <span id="error-fecha" className="mensaje-error-formulario" role="alert">
                  {erroresPedido.fecha}
                </span>
              )}
            </div>
            <div className="formulario-pedido-botones">
              <button
                type="button"
                className="boton-accion-admin"
                onClick={onCerrarFormPedido}
                disabled={enviandoPedido}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton-accion-admin boton-primario"
                onClick={onGuardarPedido}
                disabled={enviandoPedido}
              >
                {enviandoPedido ? "Guardando..." : "Guardar pedido"}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Id</th>
              <th>Título</th>
              <th>Usuario</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p._id || p.id}>
                <td data-label="Id">{(p._id || p.id || "").toString().slice(-8)}</td>
                <td data-label="Título">{tituloPedido(p)}</td>
                <td data-label="Usuario">{usuarioLabel(p)}</td>
                <td data-label="Total">
                  {typeof p.total === "number" ? `$${p.total.toLocaleString("es-AR")}` : p.total ?? "-"}
                </td>
                <td data-label="Estado">{p.estado ?? "pendiente"}</td>
                <td data-label="Fecha">{formatFecha(p.fecha || p.createdAt)}</td>
                <td data-label="Acciones">
                  <select
                    className="select-estado-pedido"
                    value={p.estado || "pendiente"}
                    onChange={(e) => onActualizarEstadoPedido?.(p._id || p.id, e.target.value)}
                    aria-label="Cambiar estado del pedido"
                  >
                    {ESTADOS_PEDIDO.map((est) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length === 0 && !mostrarFormPedido && (
          <div className="sin-datos">No hay pedidos. Usá &quot;Agregar pedido&quot; para crear uno.</div>
        )}
      </div>
    </div>
  );
};
