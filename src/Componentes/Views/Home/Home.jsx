import Categorias from "../Productos/ComponenteProducto/Categorias/Categorias";
import Galeria from "./galeria/Galeria";
import Portada from "./inicio/Portada";

const Home = () => {
  return (
    <div>
      <Galeria />
      <Categorias />
      <Portada />
    </div>
  );
};

export default Home;