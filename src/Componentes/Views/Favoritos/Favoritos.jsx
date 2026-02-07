import { Container } from 'react-bootstrap';
import { useFavoritos } from '../../Context/ContextoFavoritos';
import { useProductos } from '../../Context/ContextoProducto';
import CardProducto from '../Productos/ComponenteProducto/PaginaProductos/card-Producto/CardProducto';
import '../../../estilos/variables.css';
import './Favoritos.css';

const Favoritos = () => {
  const { favoritos } = useFavoritos();
  const { productos } = useProductos();

  const productosFavoritos = productos.filter(p => favoritos.includes(p.id));

  return (
    <Container fluid className="pagina-favoritos mt-5 py-5">
      <div className="encabezado-favoritos">
        <h2 className="titulo-seccion">
          <span className="icono-titulo">❤️</span>
          Mis Favoritos
        </h2>
        <p className="descripcion-seccion">
          {productosFavoritos.length > 0 
            ? `Tienes ${productosFavoritos.length} producto${productosFavoritos.length !== 1 ? 's' : ''} en favoritos`
            : 'No tienes productos en favoritos'}
        </p>
      </div>

      {productosFavoritos.length > 0 ? (
        <div className="contenedor-cards-favoritos">
          {productosFavoritos.map(producto => (
            <CardProducto
              key={producto.id}
              id={producto.id}
              marca={producto.marca}
              modelo={producto.modelo}
              año={producto.año}
              precio={producto.precio}
              imagen={producto.imagen}
              kilometros={producto.kilometros}
              ubicacion={producto.ubicacion}
              descripcion={producto.descripcion}
              destacado={producto.destacado}
              stock={producto.stock}
            />
          ))}
        </div>
      ) : (
        <div className="mensaje-vacio">
          <div className="icono-vacio">🤍</div>
          <h3>No hay favoritos aún</h3>
          <p>Explora nuestro catálogo y marca tus motos favoritas</p>
        </div>
      )}
    </Container>
  );
};

export default Favoritos;
