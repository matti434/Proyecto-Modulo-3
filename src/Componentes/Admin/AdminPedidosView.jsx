import React from "react";

/**
  View pura para la sección de Pedidos
  Solo recibe props y renderiza UI
 */
export const AdminPedidosView = ({
  pedidos,
  pedidoActual,
  modoPedido,
  onPedidoActualChange,
  onGuardarPedido,
  onEditarPedido,
  onEliminarPedido,
}) => {
  return (
    <div className="contenedor-tabla">
      <h2>Gestión de Pedidos</h2>

      <form
        className="form-comentario"
        onSubmit={(e) => {
          e.preventDefault();
          onGuardarPedido();
        }}
      >
        <input
          type="text"
          placeholder="Título del pedido"
          className="input-textarea"
          value={pedidoActual.titulo}
          onChange={(e) =>
            onPedidoActualChange({ ...pedidoActual, titulo: e.target.value })
          }
        />
        <textarea
          placeholder="Descripción del pedido"
          className="input-textarea"
          value={pedidoActual.descripcion}
          onChange={(e) =>
            onPedidoActualChange({
              ...pedidoActual,
              descripcion: e.target.value,
            })
          }
        />

        <button className="boton-agregar" type="submit">
          {modoPedido === "agregar" ? "Crear pedido" : "Guardar cambios"}
        </button>
      </form>

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td data-label="Titulo">{p.titulo}</td>
                <td data-label="Descripción">{p.descripcion}</td>
                <td data-label="Acciones">
                  <div className="acciones">
                    <button
                      className="boton-editar"
                      onClick={() => onEditarPedido(p)}
                    >
                      ✏️
                    </button>
                    <button
                      className="boton-eliminar"
                      onClick={() => onEliminarPedido(p.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pedidos.length === 0 && (
          <div className="sin-datos">No hay pedidos creados</div>
        )}
      </div>
    </div>
  );
};
