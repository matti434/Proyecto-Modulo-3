import { useState } from "react";

const ImagenProducto = ({ imagen, nombre, onError, onClick }) => {
  const [error, setError] = useState(false);

  if (!imagen) {
    return <span className="sin-imagen">Sin imagen</span>;
  }

  const handleError = () => {
    setError(true);
    onError?.();
  };

  const handleClick = () => {
    if (!error) {
      onClick?.();
      window.open(imagen, "_blank");
    }
  };

  return (
    <div className="contenedor-imagen-tabla">
      {error ? (
        <div className="imagen-error">Error</div>
      ) : (
        <img
          src={imagen}
          alt={nombre}
          onError={handleError}
          onClick={handleClick}
          title="Click para ver imagen completa"
        />
      )}
    </div>
  );
};

/**
  View pura para la sección de Productos
  Solo recibe props y renderiza UI
 */
export const AdminProductosView = ({
  productos,
  estadisticas,
  valorTotalProductos,
  onAbrirFormulario,
  onEditarProducto,
  onEliminarProducto,
}) => {
  return (
    <div className="contenedor-tabla">
      <div className="encabezado-productos">
        <h2>Gestión de Productos</h2>
        <button className="boton-agregar" onClick={onAbrirFormulario}>
          Agregar Producto
        </button>
      </div>

      <div className="tabla-resumen">
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{estadisticas.total}</span>
          <span className="texto-resumen">Total Productos</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">${valorTotalProductos}</span>
          <span className="texto-resumen">Valor Total</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{estadisticas.destacados}</span>
          <span className="texto-resumen">Destacados</span>
        </div>
        <div className="tarjeta-resumen">
          <span className="numero-resumen">{estadisticas.disponibles}</span>
          <span className="texto-resumen">En Stock</span>
        </div>
      </div>

      <div className="tabla-responsive">
        <table className="tabla-administracion">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Marca/Modelo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td data-label="Imagen">
                  <ImagenProducto imagen={p.imagen} nombre={p.nombre} />
                </td>
                <td data-label="Nombre">
                  <div className="info-producto">
                    <strong className="nombre-producto">{p.nombre}</strong>
                    <div className="detalles-adicionales">
                      {p.año && <span className="detalle">{p.año}</span>}
                      {p.kilometros && (
                        <span className="detalle">{p.kilometros}</span>
                      )}
                      {p.ubicacion && (
                        <span className="detalle">{p.ubicacion}</span>
                      )}
                    </div>
                    {p.descripcion && (
                      <div className="descripcion-corta" title={p.descripcion}>
                        {p.descripcion.length > 60
                          ? `${p.descripcion.substring(0, 60)}...`
                          : p.descripcion}
                      </div>
                    )}
                  </div>
                </td>
                <td data-label="Precio">
                  <span className="precio-producto">
                    ${parseFloat(p.precio).toFixed(2)}
                  </span>
                </td>
                <td data-label="Categoría">
                  <span className="badge-categoria">{p.categoria}</span>
                </td>
                <td data-label="Marca/Modelo">
                  <div className="marca-modelo">
                    <span className="marca">{p.marca}</span>
                    <span className="modelo">{p.modelo}</span>
                  </div>
                </td>
                <td data-label="Estado">
                  <div className="estados-producto">
                    {p.destacado && (
                      <span
                        className="badge-destacado"
                        title="Producto destacado"
                      >
                        Destacado
                      </span>
                    )}
                    {!p.stock && (
                      <span className="badge-sin-stock" title="Sin stock">
                        Sin stock
                      </span>
                    )}
                    {p.stock && !p.destacado && (
                      <span className="badge-destacado" title="Disponible">
                        Disponible
                      </span>
                    )}
                  </div>
                </td>
                <td data-label="Acciones">
                  <div className="acciones">
                    <button
                      className="boton-editar"
                      onClick={() => onEditarProducto(p)}
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button
                      className="boton-eliminar"
                      onClick={() => onEliminarProducto(p.id)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && (
          <div className="sin-datos">
            No hay productos registrados. ¡Agrega el primero!
          </div>
        )}
      </div>
    </div>
  );
};
