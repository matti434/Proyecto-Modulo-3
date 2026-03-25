import { useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from '../../../../../Context/ContextoCarrito';
import { useUser } from '../../../../../Context/ContextoUsuario';

import { crearProductoData, validarStock, PRODUCTO_DEFAULT, formatearPrecio } from '../../../../../Utils/productoUtils';
import toast from 'react-hot-toast';
import '../../../../../../estilos/variables.css';
import './DetalleProducto.css';

const DetalleProducto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const { estaAutenticado, esAdministrador } = useUser();

  // Usar producto de navegación o valores por defecto
  const productoData = location.state?.producto || PRODUCTO_DEFAULT;

  const handleComprarAhora = () => {

    if (!estaAutenticado) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (esAdministrador) {
      toast.error('Los administradores no pueden usar el carrito');
      return;
    }

    if (!validarStock(productoData)) {
      toast.error('Este producto no está disponible');
      return;
    }

    const productoConId = crearProductoData(productoData);
    agregarAlCarrito(productoConId, 1);
    navigate('/carrito');
  };

  const handleAgregarAlCarrito = () => {

    if (!estaAutenticado) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (esAdministrador) {
      toast.error('Los administradores no pueden usar el carrito');
      return;
    }

    if (!validarStock(productoData)) {
      toast.error('Este producto no está disponible');
      return;
    }

    const productoConId = crearProductoData(productoData);
    agregarAlCarrito(productoConId, 1);

    toast.success(`${productoData.marca} ${productoData.modelo} agregado al carrito`);
  };

  return (
    <div className="detalle-producto-container">
      <div className="detalle-producto-card">
        <div className="detalle-producto-grid">

          <div className="detalle-imagen-section">
            <div className="detalle-imagen-wrapper">
              <img
                src={productoData.imagen}
                alt={`${productoData.marca} ${productoData.modelo}`}
                className="detalle-imagen"
              />
              <div className="detalle-badges">
                {productoData.destacado && (
                  <span className="detalle-badge detalle-badge-destacado">
                    ★ Destacado
                  </span>
                )}
                <span className={`detalle-badge ${productoData.stock ? 'detalle-badge-disponible' : 'detalle-badge-agotado'}`}>
                  {productoData.stock ? '✓ Disponible' : '✕ Agotado'}
                </span>
              </div>
            </div>

            <div className="detalle-specs-grid">
              <div className="detalle-spec-card">
                <div className="detalle-spec-icon">📍</div>
                <div className="detalle-spec-content">
                  <p className="detalle-spec-label">Ubicación</p>
                  <p className="detalle-spec-value">{productoData.ubicacion}</p>
                </div>
              </div>
              <div className="detalle-spec-card">
                <div className="detalle-spec-icon">⚙️</div>
                <div className="detalle-spec-content">
                  <p className="detalle-spec-label">Kilometraje</p>
                  <p className="detalle-spec-value">{productoData.kilometros} km</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detalle-info-section">
            <div className="detalle-header-info">
              <div>
                <span className="detalle-marca-tag">{productoData.marca}</span>
                <h1 className="detalle-modelo-title">{productoData.modelo}</h1>
              </div>
              <span className="detalle-year">{productoData.año}</span>
            </div>

            <div className="detalle-price-box">
              <span className="detalle-price-label">Precio</span>
              <span className="detalle-price-value">{formatearPrecio(productoData.precio)}</span>
            </div>

            <div className="detalle-description">
              <h3 className="detalle-description-title">Descripción</h3>
              <p className="detalle-description-text">{productoData.descripcion}</p>
            </div>

            <div className="detalle-actions">
              <button
                className={`detalle-btn detalle-btn-primary ${!productoData.stock || !estaAutenticado || esAdministrador ? 'detalle-btn-disabled' : ''}`}
                disabled={!productoData.stock || !estaAutenticado || esAdministrador}
                onClick={handleComprarAhora}
              >
                💳 Comprar Ahora
              </button>

              <button
                className={`detalle-btn detalle-btn-secondary ${!productoData.stock || !estaAutenticado || esAdministrador ? 'detalle-btn-disabled' : ''}`}
                disabled={!productoData.stock || !estaAutenticado || esAdministrador}
                onClick={handleAgregarAlCarrito}
              >
                🛒 Agregar al Carrito
              </button>
            </div>

            {!productoData.stock && (
              <div className="detalle-stock-message">
                Producto agotado - Próximo stock disponible pronto
              </div>
            )}

            {productoData.stock && (
              <div className="detalle-info-message">
                Producto disponible para entrega inmediata
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;