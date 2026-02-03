import { useUser } from '../Context/ContextoUsuario';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  const { usuarioActual, esAdministrador, cargando } = useUser();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!usuarioActual || !esAdministrador) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegida;