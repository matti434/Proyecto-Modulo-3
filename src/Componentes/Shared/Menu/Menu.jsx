import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Login from "../../Views/Login/Login";
import { NavBarPrincipal } from "./NavBarPrincipal/NavBarPrincipal";
import { Registro } from "../../Views/Registro/Registro";

const Menu = () => {
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const [modalAbierto, setModalAbierto] = useState(null);

  useEffect(() => {
    setModalAbierto(null);
  }, [ubicacion.pathname]);

  useEffect(() => {
    const parametroBusqueda = new URLSearchParams(ubicacion.search);
    const tipoModal = parametroBusqueda.get("modal");
    
    if (tipoModal === "login" || tipoModal === "registro") {
      setModalAbierto(tipoModal);
    }
  }, [ubicacion.search]);

  const onClose = () => {
    setModalAbierto(null);
    if (ubicacion.search.includes("modal=")) {
      navigate(ubicacion.pathname);
    }
  };

  const abrirLogin = () => {
    setModalAbierto("login");
  };

  const abrirRegistro = () => {
    setModalAbierto("registro");
  };

  return (
    <>
      <NavBarPrincipal
        onAbrirRegistro={abrirRegistro}
        onAbrirLogin={abrirLogin}
      />
      {modalAbierto === "login" && (
        <Login
          onClose={onClose}
          onAbrirRegistro={abrirRegistro}
        />
      )}
      {modalAbierto === "registro" && (
        <Registro onClose={onClose} />
      )}
    </>
  );
};

export default Menu;