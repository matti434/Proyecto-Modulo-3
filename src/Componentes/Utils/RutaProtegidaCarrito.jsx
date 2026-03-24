import { useUser } from '../Context/ContextoUsuario';
import { Navigate } from 'react-router-dom';

/**
 * Protege la ruta del carrito: solo usuarios autenticados que NO sean admin.
 * Invitados y admin son redirigidos.
 */
const RutaProtegidaCarrito = ({ children }) => {
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

  if (!usuarioActual) {
    return <Navigate to="/login?redirect=/carrito" replace />;
  }

  if (esAdministrador) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaProtegidaCarrito;
