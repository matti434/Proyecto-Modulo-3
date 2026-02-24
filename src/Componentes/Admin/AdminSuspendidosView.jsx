
export const AdminSuspendidosView = ({
  usuariosSuspendidos,
  totalSuspendidos,
  suspendidosMas30Dias,
  onReactivarUsuario,
  onEliminarUsuarioSuspendido,
}) => {
 
  const calcularDiasSuspendido = (fechaSuspension) => {
    const fecha = new Date(fechaSuspension);
    const hoy = new Date();
    return Math.floor((hoy - fecha) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="contenedor-tabla">
      <h2>Usuarios Suspendidos</h2>

      <div className="tabla-resumen">
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{totalSuspendidos}</span>
          <span className="texto-resumen">Total Suspendidos</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{suspendidosMas30Dias}</span>
          <span className="texto-resumen">Más de 30 días</span>
        </div>
      </div>

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Fecha Suspensión</th>
              <th>Días Suspendido</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosSuspendidos.map((u) => {
              const diffDias = calcularDiasSuspendido(u.fechaSuspension);
              const fechaSuspension = new Date(u.fechaSuspension);

              return (
                <tr key={u.id}>
                  <td data-label="Usuario">
                    <div className="info-usuario">
                      <span className="nombre-usuario">
                        {u.nombreDeUsuario}
                      </span>
                      <span className="rol-usuario">{u.role}</span>
                    </div>
                  </td>
                  <td data-label="Email">{u.email}</td>
                  <td data-label="Fecha Suspensión">
                    {fechaSuspension.toLocaleDateString()}
                  </td>
                  <td data-label="Días Suspendido">
                    <span
                      className={`badge-dias ${
                        diffDias > 30 ? "badge-peligro" : "badge-advertencia"
                      }`}
                    >
                      {diffDias} días
                    </span>
                  </td>
                  <td data-label="Acciones">
                    <div className="acciones">
                      <button
                        className="boton-reactivar"
                        onClick={() => onReactivarUsuario(u.id)}
                        title="Reactivar usuario"
                      >
                        ✅
                      </button>
                      <button
                        className="boton-eliminar"
                        onClick={() => onEliminarUsuarioSuspendido(u.id)}
                        title="Eliminar permanentemente"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {usuariosSuspendidos.length === 0 && (
          <div className="sin-datos">No hay usuarios suspendidos</div>
        )}
      </div>
    </div>
  );
};
