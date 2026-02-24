import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaGlobe, FaUser, FaUserPlus, FaShoppingCart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useCarrito } from "../../../Context/ContextoCarrito";
import { useUser } from "../../../Context/ContextoUsuario";
import MenuUsuario from "./menuUsuario/MenuUsuario";

import "./NavBarPrincipal.css";

export const NavBarPrincipal = ({ onAbrirRegistro, onAbrirLogin }) => {
  const { usuarioActual } = useUser();
  const { itemsCarrito } = useCarrito();
  const { t, i18n } = useTranslation();

  const cambiarIdioma = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      fixed="top"
      className="navbar-moderno"
    >
      <Container fluid="xl" className="px-3 px-lg-4">
        {/* Logo/Marca */}
        <Navbar.Brand as={Link} to="/" className="logo-brand">
          <span className="logo-text">
            <span className="logo-primary">Rolling</span>
            <span className="logo-secondary">Motor</span>
          </span>
        </Navbar.Brand>

        {/* Botón hamburguesa para móvil */}
        <div className="mobile-menu">
          <div className="mobile-language">
            <button
              className={`mobile-lang-btn ${i18n.language === "es" ? "active" : ""}`}
              onClick={() => cambiarIdioma("es")}
            >
              ES
            </button>
            <button
              className={`mobile-lang-btn ${i18n.language === "en" ? "active" : ""}`}
              onClick={() => cambiarIdioma("en")}
            >
              EN
            </button>
          </div>

          <Navbar.Toggle aria-controls="navbar-nav">
            <span className="hamburger"></span>
            <span className="hamburger"></span>
            <span className="hamburger"></span>
          </Navbar.Toggle>
        </div>

        {/* Menú colapsable */}
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3 gap-xl-4">
            {/* Botón Carrito para Desktop */}
            {usuarioActual && (
              <Link
                to="/carrito"
                className="carrito-btn-icon d-none d-lg-flex"
                title="Carrito"
              >
                <FaShoppingCart size={20} />
                {itemsCarrito.length > 0 && (
                  <span className="carrito-badge-icon">
                    {itemsCarrito.length}
                  </span>
                )}
              </Link>
            )}

            {/* Selector de idioma para desktop */}
            <div className="language-selector">
              <button
                className={`lang-btn ${i18n.language === "es" ? "active" : ""}`}
                onClick={() => cambiarIdioma("es")}
                title="Español"
              >
                ES
              </button>
              <div className="lang-divider"></div>
              <button
                className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
                onClick={() => cambiarIdioma("en")}
                title="English"
              >
                EN
              </button>
              <FaGlobe className="lang-icon" />
            </div>

            {/* Botones de usuario: menú con perfil o login/registro */}
            {usuarioActual ? (
              <MenuUsuario />
            ) : (
              <div className="auth-buttons">
                <button className="login-btn" onClick={onAbrirLogin}>
                  <FaUser className="me-2" />
                  <span>{t("login")}</span>
                </button>
                <button className="register-btn" onClick={onAbrirRegistro}>
                  <FaUserPlus className="me-2" />
                  <span>{t("register")}</span>
                </button>
              </div>
            )}

            {/* Botones móviles (solo aparecen en móvil) */}
            {usuarioActual ? (
              <Link
                to="/carrito"
                className="carrito-btn-mobile d-lg-none"
                title="Carrito"
              >
                <FaShoppingCart size={20} />
                {itemsCarrito.length > 0 && (
                  <span className="carrito-badge-mobile">
                    {itemsCarrito.length}
                  </span>
                )}
              </Link>
            ) : (
              <div className="auth-buttons mobile d-lg-none">
                <button className="login-btn" onClick={onAbrirLogin}>
                  <FaUser className="me-2" />
                  <span>{t("login")}</span>
                </button>
                <button className="register-btn" onClick={onAbrirRegistro}>
                  <FaUserPlus className="me-2" />
                  <span>{t("register")}</span>
                </button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
