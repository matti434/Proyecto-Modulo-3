/**
 * View pura para la sección Home del admin: portada y galería.
 * Permite subir/cambiar imagen de portada y gestionar ítems de la galería.
 */
export const AdminHomeView = ({
  portadaImagenUrl,
  galeria,
  portadaSubiendo,
  galeriaSubiendo,
  galeriaActualizandoId,
  errorHome,
  onSubirPortada,
  onAgregarImagenGaleria,
  onActualizarTextoGaleria,
  onReemplazarImagenGaleria,
  onEliminarImagenGaleria,
}) => {
  const handlePortadaFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onSubirPortada(file);
    e.target.value = "";
  };

  const handleNuevaGaleriaFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onAgregarImagenGaleria(file, "");
    e.target.value = "";
  };

  return (
    <div className="contenedor-tabla">
      <h2>Contenido de la página de Inicio</h2>
      {errorHome && (
        <p className="mensaje-error-formulario" role="alert">
          {errorHome}
        </p>
      )}

      <section className="seccion-home-admin" style={{ marginBottom: "2rem" }}>
        <h3>Imagen de portada</h3>
        <p className="texto-ayuda-admin">
          Esta imagen se muestra en la parte superior de la página de inicio.
        </p>
        <div className="portada-admin-preview">
          {portadaImagenUrl ? (
            <img
              src={portadaImagenUrl}
              alt="Portada actual"
              className="vista-previa-imagen"
              style={{ maxWidth: 320, maxHeight: 200, objectFit: "contain" }}
            />
          ) : (
            <span className="sin-imagen">Sin imagen de portada</span>
          )}
        </div>
        <div className="acciones-portada-admin">
          <label className="boton-subir-imagen-admin">
            {portadaSubiendo ? "Subiendo..." : "Cambiar imagen de portada"}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handlePortadaFile}
              disabled={portadaSubiendo}
              hidden
            />
          </label>
        </div>
      </section>

      <section className="seccion-home-admin">
        <h3>Galería de la home</h3>
        <p className="texto-ayuda-admin">
          Imágenes del carrusel de la página de inicio. Podés editar el texto,
          reemplazar o eliminar cada imagen.
        </p>
        <div className="acciones-galeria-admin">
          <label className="boton-subir-imagen-admin">
            {galeriaSubiendo ? "Subiendo..." : "Añadir imagen a la galería"}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleNuevaGaleriaFile}
              disabled={galeriaSubiendo}
              hidden
            />
          </label>
        </div>
        <div className="tabla-responsive">
          <table className="tabla-administracion">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Texto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {(!galeria || galeria.length === 0) && (
                <tr>
                  <td colSpan={3}>No hay imágenes en la galería.</td>
                </tr>
              )}
              {galeria?.map((item) => (
                <tr key={item.id ?? item._id ?? item.url}>
                  <td>
                    <div className="contenedor-imagen-tabla">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt=""
                          style={{
                            width: 80,
                            height: 50,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span className="sin-imagen">Sin imagen</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <input
                      type="text"
                      className="input-texto-galeria-admin"
                      defaultValue={item.texto ?? ""}
                      onBlur={(e) => {
                        const nuevo = e.target.value?.trim() ?? "";
                        const id = item.id ?? item._id;
                        if (id && nuevo !== (item.texto ?? "")) {
                          onActualizarTextoGaleria(id, nuevo);
                        }
                      }}
                      placeholder="Texto de la diapositiva"
                      style={{ width: "100%", maxWidth: 400 }}
                    />
                  </td>
                  <td>
                    <label className="boton-accion-admin pequeno">
                      <label className="boton-accion-admin pequeno dorado"></label>
                      Cambiar imagen
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(ev) => {
                          const f = ev.target.files?.[0];
                          const id = item.id ?? item._id;
                          if (f && id) onReemplazarImagenGaleria(id, f);
                          ev.target.value = "";
                        }}
                        disabled={!!galeriaActualizandoId}
                        hidden
                      />
                    </label>
                    <button
                      type="button"
                      className="boton-accion-admin pequeno peligro"
                      onClick={() => {
                        const id = item.id ?? item._id;
                        if (id) onEliminarImagenGaleria(id);
                      }}
                      disabled={!!galeriaActualizandoId}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
