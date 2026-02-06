import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../Context/ContextoUsuario';

export const useLoginViewModel = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useUser();

  const iniciarSesion = useCallback(async (data) => {
    try {
      const resultado = await login(data);

      if (resultado.login) {
        toast.success("Login exitoso ✔");
        onClose();

        if (resultado.usuario.role === "admin") {
          setTimeout(() => {
            toast.custom(
              (t) => (
                <div 
                  className="toast-admin-royal-enfield"
                  style={{
                    background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
                    color: '#e8e1c4',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '2px solid #c89b2b',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
                    fontFamily: "'Montserrat', sans-serif",
                    maxWidth: '450px',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 9999
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '4px',
                    background: 'linear-gradient(90deg, #c89b2b, #8c6a2f)',
                  }}></div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      background: '#c89b2b',
                      color: '#111111',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      ⚙️
                    </div>
                    
                    <div>
                      <h4 style={{
                        margin: '0',
                        color: '#c89b2b',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        fontFamily: "'Cinzel', serif"
                      }}>
                        Panel de Administrador
                      </h4>
                      <p style={{
                        margin: '5px 0 0 0',
                        fontSize: '0.95rem',
                        opacity: '0.9'
                      }}>
                        Acceso detectado como administrador
                      </p>
                    </div>
                  </div>
                  
                  <p style={{
                    marginBottom: '1.5rem',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#e8e1c4'
                  }}>
                    ¿Deseas ir al panel de administrador para gestionar usuarios y productos?
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                      }}
                      style={{
                        background: 'transparent',
                        color: '#e8e1c4',
                        border: '1px solid #5f5f5f',
                        padding: '0.6rem 1.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Montserrat', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(95, 95, 95, 0.2)';
                        e.target.style.borderColor = '#e8e1c4';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.borderColor = '#5f5f5f';
                      }}
                    >
                      No, gracias
                    </button>
                    
                    <button
                      onClick={() => {
                        toast.dismiss(t.id);
                        navigate("/admin");
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #c89b2b 0%, #8c6a2f 100%)',
                        color: '#111111',
                        border: 'none',
                        padding: '0.6rem 1.8rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        fontFamily: "'Montserrat', sans-serif",
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(200, 155, 43, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Ir al Panel
                    </button>
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    color: '#5f5f5f',
                    textAlign: 'right',
                    fontStyle: 'italic'
                  }}>
                    Este mensaje se cerrará en 10 segundos
                  </div>
                </div>
              ),
              {
                duration: 10000,
                position: 'top-center',
                id: 'admin-toast',
              }
            );
            setTimeout(() => toast.dismiss('admin-toast'), 10000);
          }, 800);
        } else {
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
        
        return { exito: true };
      } else {
        return { exito: false, mensaje: resultado.mensaje || "Error al iniciar sesión" };
      }
    } catch (error) {
      console.error("useLoginViewModel - Error:", error);
      toast.error("Error inesperado: " + error.message);
      return { exito: false, mensaje: error.message };
    }
  }, [login, onClose, navigate]);

  return {
    iniciarSesion
  };
};
