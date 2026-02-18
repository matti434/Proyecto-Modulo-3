const ESTADOS_PEDIDO = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];

/**
 * Vista de pedidos desde la API.
 * Muestra lista de pedidos y permite actualizar el estado.
 */
export const AdminPedidosView = ({
  pedidos,
  pedidosCargando = false,
  onActualizarEstadoPedido,
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
        Los pedidos se crean desde el carrito en el checkout. Aquí puedes ver el listado y actualizar el estado.
      </p>

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Id</th>
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
                <td data-label="Usuario">{usuarioLabel(p)}</td>
                <td data-label="Total">
                  {typeof p.total === "number" ? `$${p.total.toLocaleString("es-AR")}` : p.total ?? "-"}
                </td>
                <td data-label="Estado">{p.estado ?? "pendiente"}</td>
                <td data-label="Fecha">{formatFecha(p.createdAt)}</td>
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
        {pedidos.length === 0 && (
          <div className="sin-datos">No hay pedidos. Los pedidos aparecen cuando un usuario finaliza una compra desde el carrito.</div>
        )}
      </div>
    </div>
  );
};
