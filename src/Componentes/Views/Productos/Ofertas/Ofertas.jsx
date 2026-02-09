import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../../estilos/variables.css";
import "./Ofertas.css";

const Ofertas = ({
    marca = "Royal Enfield",
    modelo = "Classic 350",
    año = 2020,
    precio = "450000",
    precioOriginal = "520000", 
    imagen = "https://images.pexels.com/photos/5192876/pexels-photo-5192876.jpeg",
    kilometros = "12,000",
    ubicacion = "Buenos Aires, AR",
    descripcion = "Mantenimiento al día. Color original. Algunos detalles estéticos mínimos.",
    destacado = true,
    stock = true,
    finOferta = new Date().getTime() + 24 * 60 * 60 * 1000 
}) => {
    const navigate = useNavigate();
    const calcularTiempoRestante = () => {
        const ahora = new Date().getTime();
        const diferencia = finOferta - ahora;

        if (diferencia <= 0) {
            return { horas: 0, minutos: 0, segundos: 0, finalizada: true };
        }

        const horas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        return { horas, minutos, segundos, finalizada: false };
    };

    const [tiempoRestante, setTiempoRestante] = useState(calcularTiempoRestante());

    useEffect(() => {
        const timer = setInterval(() => {
            setTiempoRestante(calcularTiempoRestante());
        }, 1000);

        return () => clearInterval(timer);
    }, [finOferta]);

    const handleComprarClick = () => {
        navigate('/detalle-producto');
    };

    const calcularDescuento = () => {
        if (!precioOriginal) return 0;
        const precioNum = parseFloat(precio.replace(/[^\d]/g, ''));
        const precioOriginalNum = parseFloat(precioOriginal.replace(/[^\d]/g, ''));
        return Math.round(((precioOriginalNum - precioNum) / precioOriginalNum) * 100);
    };

    const descuento = calcularDescuento();
    const ofertaActiva = descuento > 0 && !tiempoRestante.finalizada;

    return (
        <div className={`card-moto ${destacado ? 'destacada' : ''} ${!stock ? 'sin-stock' : ''} ${ofertaActiva ? 'con-oferta' : ''}`} style={{ maxWidth: '320px', margin: '10px' }}>

            {ofertaActiva && (
                <div className="badge-descuento">-{descuento}%</div>
            )}
            
            <div className="barra-superior-color" />
            <div className="contenedor-imagen-moto">
                <img
                    className="imagen-moto"
                    src={imagen}
                    alt={`${marca} ${modelo}`}
                    loading="lazy"
                />
                <span className="etiqueta-año">{año}</span>
            </div>
            <div className="contenido-card">
                <div className="marca-modelo">
                    <div className="nombre-marca">{marca}</div>
                    <h3 className="nombre-modelo">{modelo}</h3>
                </div>
                <div className="lista-especificaciones">
                    <div className="item-especificacion">
                        <div className="nombre-caracteristica">Kilómetros</div>
                        <div className="valor-caracteristica">{kilometros}</div>
                    </div>
                    <div className="item-especificacion">
                        <div className="nombre-caracteristica">Ubicación</div>
                        <div className="valor-caracteristica">{ubicacion}</div>
                    </div>
                </div>
                <p className="descripcion-moto">{descripcion}</p>

                {ofertaActiva && (
                    <div className="contenedor-temporizador">
                        <div className="icono-temporizador">⏰</div>
                        <div className="texto-temporizador">
                            {tiempoRestante.finalizada ? (
                                "Oferta finalizada"
                            ) : (
                                `Oferta termina en: ${tiempoRestante.horas}h ${tiempoRestante.minutos}m ${tiempoRestante.segundos}s`
                            )}
                        </div>
                    </div>
                )}

                <div className="contenedor-precio">

                    {precioOriginal && ofertaActiva && (
                        <div className="precio-original">
                            ${precioOriginal}
                        </div>
                    )}
                    
                    <div className="texto-precio-desde">Precio</div>
                    <div className="valor-precio">${precio}</div>
                    <div className="texto-precio-final">Financiación disponible</div>
                </div>
                <div className="contenedor-botones">
                    <button
                        className={`boton-contactar ${!stock ? 'boton-deshabilitado' : ''}`}
                        onClick={handleComprarClick}
                        disabled={!stock}
                    >
                        {stock ? 'Comprar' : 'Agotada'}
                    </button>
                    <button
                        className={`boton-carrito ${!stock ? 'boton-deshabilitado' : ''}`}
                        disabled={!stock}
                    >
                        {stock ? 'Agregar al carrito' : 'No disponible'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Ofertas;