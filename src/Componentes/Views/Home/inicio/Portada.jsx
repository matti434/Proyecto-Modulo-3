import "./Portada.css";

const Portada = ({ imagenUrl = "" }) => {
  return (
    <div className="portada-container mt-5 py-5">
      <div className="portada-imagen-wrapper">
        {imagenUrl && (
          <img
            src={imagenUrl}
            alt="Portada Rolling Motors"
            className="portada-imagen"
          />
        )}
      </div>
      <h2 className="portada-titulo">
        UN MOTOR QUE REALMENTE ESTÁ CONSTRUIDA COMO UN ARMA <br />Y VA COMO UNA
        BALA
      </h2>
      <p className="portada-descripcion">
        Al subirse a una moto de Rolling Motors, diseñado para reemplazar a la
        competencia, con un motor imparable, tanto que el acelerador a fondo te
        empuja hacia atrás con fuerza.
      </p>
    </div>
  );
};

export default Portada;
