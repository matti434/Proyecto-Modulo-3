import { LIMITES } from "../Utils/ValidacionesForm";

const L = LIMITES.producto;

/**
 * View pura para el formulario de producto.
 * Los límites de caracteres vienen solo de ValidacionesForm (LIMITES).
 */
export const AdminFormularioView = ({
  modo,
  datosFormulario,
  errorImagen,
  enviando,
  subiendoImagen = false,
  errorUploadImagen = "",
  errores = {},
  onGuardar,
  onCancelar,
  onCambioCampo,
  onErrorImagen,
  onArchivoSeleccionado,
}) => {
  const esEdicion = modo === "editar";
  const urlVistaPrevia = datosFormulario.imagen;

  return (
    <div className="superposicion-formulario">
      <div className="contenedor-formulario">
        <h3>{esEdicion ? "Editar Producto" : "Agregar Nuevo Producto"}</h3>
        <form onSubmit={onGuardar} noValidate>
          <div className="campo-formulario">
            <label htmlFor="nombre">Nombre del producto</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ejm: Motocicleta Yamaha MT-07"
              value={datosFormulario.nombre}
              onChange={(e) => onCambioCampo("nombre", e.target.value.slice(0, L.nombre))}
              maxLength={L.nombre}
              required
              disabled={enviando}
              className={errores.nombre ? "input-invalido" : ""}
              aria-invalid={!!errores.nombre}
            />
            {errores.nombre && <span className="mensaje-error-formulario" role="alert">{errores.nombre}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="precio">Precio (USD)</label>
            <input
              id="precio"
              type="number"
              placeholder="Ejm: 999.99"
              value={datosFormulario.precio}
              onChange={(e) => {
                const val = e.target.value;
                if (val.length <= L.precio) onCambioCampo("precio", val);
              }}
              required
              min="0"
              step="0.01"
              max="9999999.99"
              disabled={enviando}
              className={errores.precio ? "input-invalido" : ""}
              aria-invalid={!!errores.precio}
            />
            {errores.precio && <span className="mensaje-error-formulario" role="alert">{errores.precio}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              value={datosFormulario.categoria}
              onChange={(e) => onCambioCampo("categoria", e.target.value)}
              required
              disabled={enviando}
              className={errores.categoria ? "input-invalido" : ""}
              aria-invalid={!!errores.categoria}
            >
              <option value="">Seleccione una categoría</option>
              <option value="motos">Motos</option>
              <option value="protecciones">Protecciones</option>
              <option value="indumentaria">Indumentaria</option>
              <option value="accesorios">Accesorios</option>
              <option value="repuestos">Repuestos</option>
            </select>
            {errores.categoria && <span className="mensaje-error-formulario" role="alert">{errores.categoria}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="imagen">Imagen del producto</label>
            <input
              id="imagen-file"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              disabled={enviando || subiendoImagen}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onArchivoSeleccionado?.(file);
                e.target.value = "";
              }}
            />
            {subiendoImagen && <p className="estado-subida">Subiendo imagen...</p>}
            {errorUploadImagen && (
              <span className="mensaje-error-formulario" role="alert">{errorUploadImagen}</span>
            )}
            <input
              id="imagen"
              type="url"
              placeholder="O pega aquí la URL de la imagen"
              value={datosFormulario.imagen}
              onChange={(e) => {
                onCambioCampo("imagen", e.target.value.slice(0, L.imagen));
                onErrorImagen(false);
              }}
              maxLength={L.imagen}
              required
              disabled={enviando}
              className={errores.imagen ? "input-invalido" : ""}
              aria-invalid={!!errores.imagen}
            />
            {errores.imagen && <span className="mensaje-error-formulario" role="alert">{errores.imagen}</span>}
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
              <label htmlFor="marca">Marca</label>
              <input
                id="marca"
                type="text"
                placeholder="Ejm: Yamaha, Honda"
                value={datosFormulario.marca}
                onChange={(e) => onCambioCampo("marca", e.target.value.slice(0, L.marca))}
                maxLength={L.marca}
                required
                disabled={enviando}
                className={errores.marca ? "input-invalido" : ""}
                aria-invalid={!!errores.marca}
              />
              {errores.marca && <span className="mensaje-error-formulario" role="alert">{errores.marca}</span>}
            </div>

            <div className="campo-formulario">
              <label htmlFor="modelo">Modelo</label>
              <input
                id="modelo"
                type="text"
                placeholder="Ejm: MT-07, CBR 600RR"
                value={datosFormulario.modelo}
                onChange={(e) => onCambioCampo("modelo", e.target.value.slice(0, L.modelo))}
                maxLength={L.modelo}
                required
                disabled={enviando}
                className={errores.modelo ? "input-invalido" : ""}
                aria-invalid={!!errores.modelo}
              />
              {errores.modelo && <span className="mensaje-error-formulario" role="alert">{errores.modelo}</span>}
            </div>
          </div>

          <div className="grid-campos">
            <div className="campo-formulario">
              <label htmlFor="año">Año </label>
              <input
                id="año"
                type="text"
                placeholder="Ejm: 2023"
                value={datosFormulario.año}
                onChange={(e) => onCambioCampo("año", e.target.value.slice(0, L.año).replace(/\D/g, ""))}
                maxLength={L.año}
                disabled={enviando}
                className={errores.año ? "input-invalido" : ""}
                aria-invalid={!!errores.año}
              />
              {errores.año && <span className="mensaje-error-formulario" role="alert">{errores.año}</span>}
            </div>

            <div className="campo-formulario">
              <label htmlFor="kilometros">Kilómetros</label>
              <input
                id="kilometros"
                type="text"
                placeholder="Ejm: 15,000 km"
                value={datosFormulario.kilometros}
                onChange={(e) => onCambioCampo("kilometros", e.target.value.slice(0, L.kilometros))}
                maxLength={L.kilometros}
                disabled={enviando}
                className={errores.kilometros ? "input-invalido" : ""}
                aria-invalid={!!errores.kilometros}
              />
              {errores.kilometros && <span className="mensaje-error-formulario" role="alert">{errores.kilometros}</span>}
            </div>
          </div>

          <div className="campo-formulario">
            <label htmlFor="ubicacion">Ubicación</label>
            <input
              id="ubicacion"
              type="text"
              placeholder="Ejm: Buenos Aires, Argentina"
              value={datosFormulario.ubicacion}
              onChange={(e) => onCambioCampo("ubicacion", e.target.value.slice(0, L.ubicacion))}
              maxLength={L.ubicacion}
              disabled={enviando}
              className={errores.ubicacion ? "input-invalido" : ""}
              aria-invalid={!!errores.ubicacion}
            />
            {errores.ubicacion && <span className="mensaje-error-formulario" role="alert">{errores.ubicacion}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              placeholder="Descripción detallada del producto..."
              value={datosFormulario.descripcion}
              onChange={(e) => onCambioCampo("descripcion", e.target.value.slice(0, L.descripcion))}
              maxLength={L.descripcion}
              required
              rows="4"
              disabled={enviando}
              className={errores.descripcion ? "input-invalido" : ""}
              aria-invalid={!!errores.descripcion}
            />
            {errores.descripcion && <span className="mensaje-error-formulario" role="alert">{errores.descripcion}</span>}
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
            <button type="submit" className="boton-guardar" disabled={enviando || subiendoImagen}>
              {enviando
                ? "Procesando..."
                : subiendoImagen
                  ? "Subiendo imagen..."
                  : esEdicion
                    ? "Guardar Cambios"
                    : "Agregar Producto"}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className="boton-cancelar"
              disabled={enviando || subiendoImagen}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
