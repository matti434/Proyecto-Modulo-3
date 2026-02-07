import React from "react";
import { LIMITES } from "../Utils/ValidacionesForm";

const L = LIMITES.pedido;

/**
 * View pura para la sección de Pedidos.
 * Límites de caracteres solo desde ValidacionesForm (LIMITES).
 */
export const AdminPedidosView = ({
  pedidos,
  pedidoActual,
  modoPedido,
  errores = {},
  onPedidoCampoChange,
  onGuardarPedido,
  onEditarPedido,
  onEliminarPedido,
}) => {
  return (
    <div className="contenedor-tabla">
      <h2>Gestión de Pedidos</h2>

      <form
        className="form-comentario"
        noValidate
        onSubmit={(e) => { e.preventDefault(); onGuardarPedido(); }}
      >
        <div className="campo-formulario">
          <label htmlFor="titulo-pedido" className="visually-hidden">Título </label>
          <input
            id="titulo-pedido"
            type="text"
            placeholder={`Título del pedido (máx. ${L.titulo} caracteres)`}
            className={`input-textarea placeholder-blanco ${errores.titulo ? "input-invalido" : ""}`}
            value={pedidoActual.titulo}
            onChange={(e) => onPedidoCampoChange("titulo", e.target.value.slice(0, L.titulo))}
            maxLength={L.titulo}
            aria-invalid={!!errores.titulo}
          />
          {errores.titulo && (
            <span className="mensaje-error-formulario" role="alert">{errores.titulo}</span>
          )}
        </div>
        <div className="campo-formulario">
          <label htmlFor="desc-pedido" className="visually-hidden">Descripción </label>
          <textarea
            id="desc-pedido"
            placeholder={`Descripción del pedido (máx. ${L.descripcion} caracteres)`}
            className={`input-textarea placeholder-blanco ${errores.descripcion ? "input-invalido" : ""}`}
            value={pedidoActual.descripcion}
            onChange={(e) => onPedidoCampoChange("descripcion", e.target.value.slice(0, L.descripcion))}
            maxLength={L.descripcion}
            aria-invalid={!!errores.descripcion}
          />
          {errores.descripcion && (
            <span className="mensaje-error-formulario" role="alert">{errores.descripcion}</span>
          )}
        </div>

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
