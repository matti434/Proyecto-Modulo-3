
export const AdminRecomendacionesView = ({
  recomendaciones,
  nuevoComentario,
  modoEdicion,
  onNuevoComentarioChange,
  onAgregarRecomendacion,
  onEditarRecomendacion,
  onEliminarRecomendacion,
  onCancelarEdicionRecomendacion,
}) => {
  return (
    <div className="contenedor-tabla">
      <h2>Notas y Recomendaciones</h2>

      <form
        className="form-comentario"
        onSubmit={(e) => {
          e.preventDefault();
          onAgregarRecomendacion();
        }}
      >
        <textarea
          className="input-textarea"
          placeholder="Escribe una nota..."
          value={nuevoComentario}
          onChange={(e) => onNuevoComentarioChange(e.target.value)}
        />

        <button className="boton-agregar" type="submit">
          {modoEdicion ? "Guardar Nota" : "Añadir Nota"}
        </button>

        {modoEdicion && (
          <button
            className="boton-cancelar"
            type="button"
            onClick={onCancelarEdicionRecomendacion}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Comentario</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {recomendaciones.map((r) => (
              <tr key={r.id}>
                <td data-label="Comentario">{r.texto}</td>

                <td data-label="Acciones">
                  <div className="acciones">
                    <button
                      className="boton-editar"
                      onClick={() => onEditarRecomendacion(r)}
                    >
                      ✏️
                    </button>

                    <button
                      className="boton-eliminar"
                      onClick={() => onEliminarRecomendacion(r.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recomendaciones.length === 0 && (
          <div className="sin-datos">No hay notas creadas aún</div>
        )}
      </div>
    </div>
  );
};
