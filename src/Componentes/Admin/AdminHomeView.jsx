/**
 * View pura para la sección Home del admin: portada y galería.
<<<<<<< HEAD
 * Permite subir/cambiar imagen de portada y gestionar ítems de la galería.
=======
 * Permite subir/cambiar imagen de portada y gestionar ítems de la galería (imagen + texto).
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
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

<<<<<<< HEAD
=======
      {/* Sección Portada */}
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
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

<<<<<<< HEAD
      <section className="seccion-home-admin">
        <h3>Galería de la home</h3>
        <p className="texto-ayuda-admin">
          Imágenes del carrusel de la página de inicio. Podés editar el texto,
          reemplazar o eliminar cada imagen.
=======
      {/* Sección Galería */}
      <section className="seccion-home-admin">
        <h3>Galería de la home</h3>
        <p className="texto-ayuda-admin">
          Imágenes que se muestran en el carrusel de la página de inicio. Podés editar el texto y reemplazar o eliminar cada imagen.
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
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
<<<<<<< HEAD
                <tr key={item.id ?? item._id ?? item.url}>
=======
                <tr key={item.id ?? item.url}>
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
                  <td>
                    <div className="contenedor-imagen-tabla">
                      {item.url ? (
                        <img
                          src={item.url}
                          alt=""
<<<<<<< HEAD
                          style={{
                            width: 80,
                            height: 50,
                            objectFit: "cover",
                          }}
=======
                          style={{ width: 80, height: 50, objectFit: "cover" }}
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
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
<<<<<<< HEAD
                      defaultValue={item.texto ?? ""}
                      onBlur={(e) => {
                        const nuevo = e.target.value?.trim() ?? "";
                        const id = item.id ?? item._id;
                        if (id && nuevo !== (item.texto ?? "")) {
                          onActualizarTextoGaleria(id, nuevo);
=======
                      value={item.texto ?? ""}
                      onChange={(e) =>
                        onActualizarTextoGaleria(item.id, e.target.value)
                      }
                      onBlur={(e) => {
                        const nuevo = e.target.value?.trim() ?? "";
                        if (nuevo !== (item.texto ?? "")) {
                          onActualizarTextoGaleria(item.id, nuevo);
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
                        }
                      }}
                      placeholder="Texto de la diapositiva"
                      style={{ width: "100%", maxWidth: 400 }}
                    />
                  </td>
                  <td>
                    <label className="boton-accion-admin pequeno">
                      Cambiar imagen
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={(ev) => {
                          const f = ev.target.files?.[0];
<<<<<<< HEAD
                          const id = item.id ?? item._id;
                          if (f && id)
                            onReemplazarImagenGaleria(id, f);
=======
                          if (f && item.id) onReemplazarImagenGaleria(item.id, f);
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
                          ev.target.value = "";
                        }}
                        disabled={!!galeriaActualizandoId}
                        hidden
                      />
                    </label>
                    <button
                      type="button"
                      className="boton-accion-admin pequeno peligro"
<<<<<<< HEAD
                      onClick={() => {
                        const id = item.id ?? item._id;
                        if (id) onEliminarImagenGaleria(id);
                      }}
=======
                      onClick={() => item.id && onEliminarImagenGaleria(item.id)}
>>>>>>> 359c1bdea1243c644a64b0ba53146f0316c9e214
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
