import Categorias from '../Productos/ComponenteProducto/Categorias/Categorias';
import Galeria from './galeria/Galeria';
import Portada from './inicio/portada';
const Home = () => {
  return (
    <div>
      <Galeria/>
        <Categorias/> 
      <Portada/>
      <div className="mt-5 py-5">
      </div>
    </div>
  )
}
export default Home