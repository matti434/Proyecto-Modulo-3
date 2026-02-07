import { useNavigate } from 'react-router-dom'; 
import { useCarrito } from '../../../../../Context/ContextoCarrito';
import { useFavoritos } from '../../../../../Context/ContextoFavoritos';
import { 
  crearProductoData, 
  generarIdCarrito,
  validarStock,
  formatearPrecio, 
  formatearKilometros, 
  truncarTexto, 
  acortarUbicacion 
} from '../../../../../Utils/productoUtils';
import toast from 'react-hot-toast';
import '../../../../../../estilos/variables.css';
import './CardProducto.css';

const CardProducto = ({ 
  id,
  marca = "",
  modelo = "", 
  año = "",
  precio = "",
  imagen = "",
  kilometros = "",
  ubicacion = "",
  descripcion = "",
  destacado = false, 
  stock = true
}) => {

  const navigate = useNavigate(); 
  const { agregarAlCarrito } = useCarrito();
  const { toggleFavorito, esFavorito } = useFavoritos();

  const isFavorito = esFavorito(id);

  // Crear objeto producto normalizado
  const productoBase = { id, marca, modelo, año, precio, imagen, kilometros, ubicacion, descripcion, destacado, stock };

  const handleFavoritoClick = (e) => {
    e.stopPropagation();
    const eraFavorito = isFavorito;
    toggleFavorito(id);
    
    if (eraFavorito) {
      toast.error(`${marca} ${modelo} eliminado de favoritos`, {
        icon: '💔',
      });
    } else {
      toast.success(`${marca} ${modelo} agregado a favoritos`, {
        icon: '❤️',
      });
    }
  };

  const handleComprarClick = (e) => {
    if (e) e.stopPropagation();
    const productoData = crearProductoData(productoBase);
    navigate('/detalle-producto', { state: { producto: productoData } });
  };

  const handleAgregarCarrito = (e) => {
    e.stopPropagation();

    if (!validarStock({ stock })) {
      toast.error('Este producto no está disponible');
      return;
    }

    const productoData = crearProductoData({
      ...productoBase,
      id: id || generarIdCarrito()
    });

    agregarAlCarrito(productoData, 1);
    toast.success(`${marca} ${modelo} agregado al carrito`);
  };

  const handleCardClick = (e) => {
    if (!e.target.closest('button')) {
      const productoData = crearProductoData(productoBase);
      navigate('/detalle-producto', { state: { producto: productoData } });
    }
  };

  return (
    <div 
      className={`card-moto ${destacado ? 'destacada' : ''} ${!stock ? 'sin-stock' : ''}`} 
      style={{maxWidth: '320px', margin: '10px', cursor: 'pointer'}}
      onClick={handleCardClick}
    >
      <div className="barra-superior-color" />

      <div className="contenedor-imagen-moto">
        <button 
          className="boton-favorito" 
          onClick={handleFavoritoClick}
          aria-label={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {isFavorito ? '❤️' : '🤍'}
        </button>

        <img 
          className="imagen-moto" 
          src={imagen} 
          alt={`${marca} ${modelo}`} 
          loading="lazy"
        />

        <span className="etiqueta-año">{año}</span>

        {destacado && (
          <span className="etiqueta-destacado">Destacado</span>
        )}

        {!stock && (
          <span className="etiqueta-agotado">Agotado</span>
        )}
      </div>

      <div className="contenido-card ">
        <div className="marca-modelo">
          <div className="nombre-marca">{marca}</div>
          <h3 className="nombre-modelo">{modelo}</h3>
        </div>

        <div className="especificaciones-columnas">

          <div className="columna-especificacion">
            <div className="icono-especificacion">📍</div>
            <div className="contenido-especificacion">
              <div className="titulo-especificacion">Ubicación</div>
              <div className="valor-especificacion ubicacion-texto" title={ubicacion}>
                {acortarUbicacion(ubicacion)}
              </div>
            </div>
          </div>

          <div className="columna-especificacion">
            <div className="icono-especificacion">🛣️</div>
            <div className="contenido-especificacion">
              <div className="titulo-especificacion">Kilómetros</div>
              <div className="valor-especificacion km-texto">
                {formatearKilometros(kilometros)}
              </div>
            </div>
          </div>
        </div>

        <p className="descripcion-moto" title={descripcion}>
          {truncarTexto(descripcion)}
        </p>

        <div className="contenedor-precio">
          <div className="texto-precio-desde">Precio</div>
          <div className="valor-precio">${formatearPrecio(precio)}</div>
          <div className="texto-precio-final">Financiación disponible</div>
        </div>

        <div className="contenedor-botones">
          <button 
            className={`boton-contactar ${!stock ? 'boton-deshabilitado' : ''}`} 
            onClick={handleComprarClick} 
            disabled={!stock}
          >
            <span className="texto-boton">
              {stock ? 'Comprar' : 'Agotada'}
            </span>
          </button>

          <button 
            className={`boton-carrito ${!stock ? 'boton-deshabilitado' : ''}`} 
            onClick={handleAgregarCarrito}
            disabled={!stock}
          >
            <span className="texto-boton">
              {stock ? 'Agregar' : 'No disponible'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardProducto;
