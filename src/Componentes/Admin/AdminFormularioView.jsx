import React from "react";

/**
 * View pura para el formulario de producto
 * Solo recibe props y renderiza UI
 * NO tiene lógica, NO usa hooks de estado
 */
export const AdminFormularioView = ({
  modo,
  datosFormulario,
  errorImagen,
  enviando,
  onGuardar,
  onCancelar,
  onCambioCampo,
  onErrorImagen,
}) => {
  const esEdicion = modo === "editar";

  return (
    <div className="superposicion-formulario">
      <div className="contenedor-formulario">
        <h3>{esEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
        <form onSubmit={onGuardar}>
          <div className="campo-formulario">
            <label htmlFor="nombre">Nombre del producto *</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ejm: Motocicleta Yamaha MT-07"
              value={datosFormulario.nombre}
              onChange={(e) => onCambioCampo("nombre", e.target.value)}
              required
              disabled={enviando}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="precio">Precio (USD) *</label>
            <input
              id="precio"
              type="number"
              placeholder="Ejm: 999.99"
              value={datosFormulario.precio}
              onChange={(e) => onCambioCampo("precio", e.target.value)}
              required
              min="0"
              step="0.01"
              disabled={enviando}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              value={datosFormulario.categoria}
              onChange={(e) => onCambioCampo("categoria", e.target.value)}
              required
              disabled={enviando}
            >
              <option value="">Seleccione una categoría</option>
              <option value="motocicletas">Motocicletas</option>
              <option value="protecciones">Protecciones</option>
              <option value="indumentaria">Indumentaria</option>
              <option value="accesorios">Accesorios</option>
              <option value="repuestos">Repuestos</option>
            </select>
          </div>

          <div className="campo-formulario">
            <label htmlFor="imagen">URL de la imagen *</label>
            <input
              id="imagen"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={datosFormulario.imagen}
              onChange={(e) => {
                onCambioCampo("imagen", e.target.value);
                onErrorImagen(false);
              }}
              required
              disabled={enviando}
            />
            {datosFormulario.imagen && (
              <div className="vista-previa-imagen">
                {errorImagen ? (
                  <div className="fallback-imagen">
                    Error al cargar la imagen
                  </div>
                ) : (
                  <img
                    src={datosFormulario.imagen}
                    alt="Vista previa"
                    onError={() => onErrorImagen(true)}
                    onLoad={() => onErrorImagen(false)}
                  />
                )}
              </div>
            )}
          </div>

          <div className="grid-campos">
            <div className="campo-formulario">
              <label htmlFor="marca">Marca *</label>
              <input
                id="marca"
                type="text"
                placeholder="Ejm: Yamaha, Honda"
                value={datosFormulario.marca}
                onChange={(e) => onCambioCampo("marca", e.target.value)}
                required
                disabled={enviando}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="modelo">Modelo *</label>
              <input
                id="modelo"
                type="text"
                placeholder="Ejm: MT-07, CBR 600RR"
                value={datosFormulario.modelo}
                onChange={(e) => onCambioCampo("modelo", e.target.value)}
                required
                disabled={enviando}
              />
            </div>
          </div>

          <div className="grid-campos">
            <div className="campo-formulario">
              <label htmlFor="año">Año</label>
              <input
                id="año"
                type="text"
                placeholder="Ejm: 2023"
                value={datosFormulario.año}
                onChange={(e) => onCambioCampo("año", e.target.value)}
                disabled={enviando}
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="kilometros">Kilómetros</label>
              <input
                id="kilometros"
                type="text"
                placeholder="Ejm: 15,000 km"
                value={datosFormulario.kilometros}
                onChange={(e) => onCambioCampo("kilometros", e.target.value)}
                disabled={enviando}
              />
            </div>
          </div>

          <div className="campo-formulario">
            <label htmlFor="ubicacion">Ubicación</label>
            <input
              id="ubicacion"
              type="text"
              placeholder="Ejm: Buenos Aires, Argentina"
              value={datosFormulario.ubicacion}
              onChange={(e) => onCambioCampo("ubicacion", e.target.value)}
              disabled={enviando}
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              placeholder="Descripción detallada del producto..."
              value={datosFormulario.descripcion}
              onChange={(e) => onCambioCampo("descripcion", e.target.value)}
              required
              rows="4"
              disabled={enviando}
            />
          </div>

          <div className="grid-campos">
            <div className="campo-formulario">
              <label htmlFor="destacado" className="checkbox-label">
                <input
                  id="destacado"
                  type="checkbox"
                  checked={datosFormulario.destacado}
                  onChange={(e) => onCambioCampo("destacado", e.target.checked)}
                  disabled={enviando}
                />
                <span>Producto destacado</span>
              </label>
            </div>

            <div className="campo-formulario">
              <label htmlFor="stock" className="checkbox-label">
                <input
                  id="stock"
                  type="checkbox"
                  checked={datosFormulario.stock}
                  onChange={(e) => onCambioCampo("stock", e.target.checked)}
                  disabled={enviando}
                />
                <span>En stock</span>
              </label>
            </div>
          </div>

          <div className="botones-formulario">
            <button type="submit" className="boton-guardar" disabled={enviando}>
              {enviando
                ? "Procesando..."
                : esEdicion
                  ? "Guardar Cambios"
                  : "Agregar Producto"}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className="boton-cancelar"
              disabled={enviando}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
