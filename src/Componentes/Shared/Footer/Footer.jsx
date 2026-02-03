import { Link } from "react-router-dom";
import { useState } from "react";
import Login from "../../Views/Login/Login"; 
import { Registro } from "../../Views/Registro/Registro";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  const abrirLogin = () => {
    setMostrarLogin(true);
    setMostrarRegistro(false);
  };

  const abrirRegistro = () => {
    setMostrarRegistro(true);
    setMostrarLogin(false);
  };

  const cerrarLogin = () => {
    setMostrarLogin(false);
  };

  const cerrarRegistro = () => {
    setMostrarRegistro(false);
  };

  const abrirRegistroDesdeLogin = () => {
    setMostrarLogin(false);
    setMostrarRegistro(true);
  };

  const abrirLoginDesdeRegistro = () => {
    setMostrarRegistro(false);
    setMostrarLogin(true);
  };

  return (
    <>
      {/* Modal de Login */}
      {mostrarLogin && (
        <Login 
          onClose={cerrarLogin} 
          onAbrirRegistro={abrirRegistroDesdeLogin}
        />
      )}

      {/* Modal de Registro */}
      {mostrarRegistro && (
        <Registro 
          onClose={cerrarRegistro} 
          onAbrirLogin={abrirLoginDesdeRegistro}
        />
      )}

      <footer className="footer">
        <div className="footer__container">

          <div className="footer__column">
            <h4>Navegación</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>

          <div className="footer__column">
            <h4>Mi Cuenta</h4>
            <ul>
              <li><Link to="/nosotros">Nosotros</Link></li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={abrirLogin}
                >
                  Iniciar sesión
                </button>
              </li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={abrirRegistro}
                >
                  Registrarme
                </button>
              </li>
            </ul>
          </div>

          <div className="footer__column">
            <h4>Seguinos</h4>
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          <div className="footer__column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/404">Términos y Condiciones</Link></li>
              <li><Link to="/404">Política de Privacidad</Link></li>
            </ul>
          </div>

        </div>

        <div className="footer__bottom">
          <p>© {year} Ecommerce Motos. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;