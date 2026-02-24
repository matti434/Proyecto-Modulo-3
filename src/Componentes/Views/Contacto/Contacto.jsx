import Form from 'react-bootstrap/Form';
import { useRef, useState } from "react";
import emailjs from '@emailjs/browser';
import './Contacto.css';
import { Toaster } from "react-hot-toast";

const Contacto = () => {
    const form = useRef();
    const [mensajeEnviado, setMensajeEnviado] = useState(false);

    const [errores, setErrores] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        mensaje: ""
    });

    const [errorGeneral, setErrorGeneral] = useState("");

    const handleNombreChange = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    };

    const handleApellidoChange = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '');
    };

    const handleTelefonoChange = (e) => {
        e.target.value = e.target.value.replace(/\D/g, ''); 
    };

    const handleEmailChange = (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9-_@.]/g, '');
    };

    const sendEmail = (e) => {
        e.preventDefault();

        const formData = new FormData(form.current);
        const nombre = formData.get("user_name").trim();
        const apellido = formData.get("last_name").trim();
        const telefono = formData.get("user_phone").trim();
        const email = formData.get("user_email").trim();
        const mensaje = formData.get("message").trim();

        let nuevoErrores = {};
        let camposVacios = false;

        if (!nombre) { 
            nuevoErrores.nombre = "Por favor ingresa tu nombre."; 
            camposVacios = true; 
        } else if (nombre.length < 3) nuevoErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
        else if (nombre.length > 12) nuevoErrores.nombre = "El nombre no puede superar los 12 caracteres.";

        if (!apellido) { 
            nuevoErrores.apellido = "Por favor ingresa tu apellido."; 
            camposVacios = true; 
        } else if (apellido.length < 3) nuevoErrores.apellido = "El apellido debe tener al menos 3 caracteres.";
        else if (apellido.length > 12) nuevoErrores.apellido = "El apellido no puede superar los 12 caracteres.";

        if (!telefono) { 
            nuevoErrores.telefono = "Ingresa tu número de teléfono."; 
            camposVacios = true; 
        } else if (!/^\d+$/.test(telefono)) nuevoErrores.telefono = "El teléfono solo puede contener números.";

        if (!email) { 
            nuevoErrores.email = "Ingresa tu correo electrónico."; 
            camposVacios = true; 
        } else if (!/^[a-zA-Z0-9-_]+@gmail(\.[a-zA-Z]+)+$/i.test(email)) {
            nuevoErrores.email = "El correo solo puede contener letras, números, guion medio y guion bajo antes de @gmail y puntos después";
        }

        if (!mensaje) { 
            nuevoErrores.mensaje = "Escribe un mensaje para contactarnos."; 
            camposVacios = true; 
        } else if (mensaje.length > 200) nuevoErrores.mensaje = "El mensaje no puede superar los 200 caracteres.";

        setErrores(nuevoErrores);

        if (camposVacios) {
            setErrorGeneral("Por favor, completa todos los campos.");
            return;
        } else {
            setErrorGeneral("");
        }

        emailjs
            .sendForm(
                "service_2huncds",
                "template_wt8nir8",
                form.current,
                { publicKey: "4NhIAIqJh5mY2AI9S" }
            )
            .then(() => {
                setMensajeEnviado(true);
                form.current.reset();
                setErrores({ nombre:"", apellido:"", telefono:"", email:"", mensaje:"" });
            })
            .catch((error) => console.error(error));
    };

    const renderError = (mensaje) => {
        if (!mensaje) return null;
        return (
            <div style={{ color: "yellow", fontSize: "0.8rem", marginTop: "5px" }}>
                {mensaje}
            </div>
        );
    };

    return (
        <>
            <Toaster position="top-right" />

            <div style={{
                backgroundColor: "#2c2c2c",
                minHeight: "100vh",
                width: "100%",
                position: "relative"
            }}>
                <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ 
                    backgroundSize: "cover", 
                    backgroundPosition: "center", 
                    padding: "20px",
                    marginTop: "50px",
                }}>
                    <div className="row shadow-lg rounded-4 overflow-hidden" style={{ 
                        width: "75%", 
                        maxWidth: "800px", 
                        background: "rgba(214, 55, 16, 0.64)", 
                        backdropFilter: "blur(6px)", 
                        border: "1px solid yellow", 
                        borderRadius: "15px",
                        boxShadow: "0 0 20px rgba(255, 255, 0, 0.3)"
                    }}>
                        <div className="col-12 col-md-6 text-white d-flex flex-column justify-content-center p-5" style={{ 
                            background: "rgb(0, 0, 0)", 
                            backdropFilter: "blur(6px)", 
                            color: "white",
                            borderRight: "1px solid rgba(255, 255, 0, 0.3)"
                        }}>
                            <h2 className="titulo-glow" style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Rolling Motors</h2>
                            <p className="mt-3" style={{ color: "#ccc" }}>
                                Contáctanos para consultas sobre motos, repuestos y servicios.
                            </p>
                        </div>
                        <form ref={form} onSubmit={sendEmail} className="col-12 col-md-6 d-flex flex-column justify-content-center p-5" style={{ 
                            background: "rgba(88, 1, 1, 0.6)", 
                            backdropFilter: "blur(6px)", 
                            color: "white"
                        }}>
                            <h5 className="titulo-glow2 pb-3 mb-4" style={{ borderBottom: "1px solid rgba(255, 255, 0, 0.3)" }}>Datos de Contacto</h5>
                            <input 
                                id="nombre" 
                                type="text" 
                                placeholder="Nombre" 
                                name="user_name"
                                onInput={handleNombreChange}
                                className="form-control bg-transparent border-0 border-bottom text-white mb-1 rounded-0"
                                style={{ 
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.5)",
                                    padding: "10px 0",
                                    fontSize: "1rem"
                                }}
                            />
                            {renderError(errores.nombre)}
                            <input 
                                id="apellido" 
                                type="text" 
                                placeholder="Apellido" 
                                name="last_name"
                                onInput={handleApellidoChange}
                                className="form-control bg-transparent border-0 border-bottom text-white mb-1 rounded-0"
                                style={{ 
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.5)",
                                    padding: "10px 0",
                                    fontSize: "1rem"
                                }}
                            />
                            {renderError(errores.apellido)}
                            <input 
                                type="tel" 
                                placeholder="Teléfono" 
                                name="user_phone" 
                                inputMode="numeric"
                                onInput={handleTelefonoChange}
                                className="form-control bg-transparent border-0 border-bottom text-white mb-1 rounded-0"
                                style={{ 
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.5)",
                                    padding: "10px 0",
                                    fontSize: "1rem"
                                }}
                            />
                            {renderError(errores.telefono)}
                            <input 
                                id="email" 
                                type="email" 
                                placeholder="Email" 
                                name="user_email"
                                onInput={handleEmailChange}
                                className="form-control bg-transparent border-0 border-bottom text-white mb-1 rounded-0"
                                style={{ 
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.5)",
                                    padding: "10px 0",
                                    fontSize: "1rem"
                                }}
                            />
                            {renderError(errores.email)}
                            <Form.Control 
                                id="mensaje" 
                                as="textarea" 
                                rows={3} 
                                placeholder="Mensaje" 
                                name="message" 
                                className="bg-transparent text-white border-0 border-bottom rounded-0 mb-1"
                                style={{ 
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.5)",
                                    padding: "10px 0",
                                    fontSize: "1rem",
                                    resize: "none"
                                }}
                            />
                            {renderError(errores.mensaje)}
                            <button 
                                className="btn w-100 py-2 mt-2 boton-animado"
                                type="submit" 
                                style={{ 
                                    background: "rgba(0, 0, 0, 0.6)", 
                                    backdropFilter: "blur(6px)",
                                    border: "1px solid #eee605",
                                    boxShadow: "0 0 8px #eee60555", 
                                    color: "white", 
                                    fontWeight: "600",
                                    fontSize: "1.1rem",
                                    marginTop: "20px",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = "rgba(238, 230, 5, 0.2)";
                                    e.target.style.boxShadow = "0 0 15px #eee605";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "rgba(0, 0, 0, 0.6)";
                                    e.target.style.boxShadow = "0 0 8px #eee60555";
                                }}
                            >
                                Enviar
                            </button>

                            {errorGeneral && (
                                <div style={{ 
                                    color: "yellow", 
                                    fontSize: "0.9rem", 
                                    marginTop: "10px", 
                                    textAlign: "center",
                                    padding: "10px",
                                    background: "rgba(255, 255, 0, 0.1)",
                                    borderRadius: "5px"
                                }}>
                                    {errorGeneral}
                                </div>
                            )}
                            {mensajeEnviado && (
                                <div style={{ 
                                    position:"fixed", 
                                    top:0, 
                                    left:0, 
                                    width:"100%", 
                                    height:"100%", 
                                    backgroundColor:"rgba(0,0,0,0.8)", 
                                    display:"flex", 
                                    justifyContent:"center", 
                                    alignItems:"center", 
                                    zIndex:9999 
                                }}>
                                    <div style={{ 
                                        background:"rgba(0, 0, 0, 0.9)", 
                                        backdropFilter:"blur(10px)", 
                                        border:"2px solid #eee605",
                                        borderRadius:"15px", 
                                        padding:"30px", 
                                        textAlign:"center", 
                                        color:"white", 
                                        width:"90%", 
                                        maxWidth:"400px", 
                                        animation:"zoomIn 0.3s ease-out",
                                        boxShadow: "0 0 30px rgba(238, 230, 5, 0.4)"
                                    }}>
                                        <div style={{
                                            fontSize: "3rem",
                                            color: "#eee605",
                                            marginBottom: "15px"
                                        }}>
                                            ✓
                                        </div>
                                        <h3 style={{ 
                                            textShadow: "0 0 10px #eee605",
                                            color: "#eee605",
                                            marginBottom: "15px"
                                        }}>
                                            Mensaje Enviado
                                        </h3>
                                        <p style={{ color: "#fff", lineHeight: "1.5" }}>
                                            Gracias por contactarnos. Te responderemos a la brevedad.
                                        </p>
                                        <button 
                                            onClick={() => setMensajeEnviado(false)} 
                                            style={{ 
                                                marginTop:"20px", 
                                                padding:"10px 20px", 
                                                width:"80%", 
                                                maxWidth:"200px", 
                                                background:"rgba(0, 0, 0, 0.6)", 
                                                backdropFilter:"blur(6px)", 
                                                border:"1px solid #eee605", 
                                                boxShadow:"0 0 8px #eee60555", 
                                                color:"white", 
                                                fontWeight:"600", 
                                                borderRadius:"5px", 
                                                cursor:"pointer",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "rgba(238, 230, 5, 0.2)";
                                                e.target.style.boxShadow = "0 0 15px #eee605";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "rgba(0, 0, 0, 0.6)";
                                                e.target.style.boxShadow = "0 0 8px #eee60555";
                                            }}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
                <div className="container d-flex justify-content-center mt-4" style={{ paddingBottom: "30px" }}>
                    <div className="map-container-custom">
                        <div className="map-dark-overlay"></div>
                        <iframe
                            title="Rolling Motors - Ubicación"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.716108013208!2d-65.21060062485453!3d-26.830367590044737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f18!3m3!1m2!1s0x94225c128505d1c7%3A0x76c7e1982e4797d1!2sGral.%20Paz%20576%2C%20T4000%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1701123456789"
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
                <div className="container mt-4 d-flex justify-content-center" style={{ paddingBottom: "50px" }}>
                    <div style={{ 
                        width: "75%", 
                        maxWidth: "800px", 
                        color: "white", 
                        textAlign: "center",
                        background: "rgb(0, 0, 0)",
                        backdropFilter: "blur(6px)",
                        border: "1px solid yellow",
                        borderRadius: "15px",
                        padding: "30px",
                        boxShadow: "0 0 20px rgba(255, 255, 0, 0.1)"
                    }}>
                        <h3 className="fw-bold mb-4" style={{ color: "rgba(233, 64, 22, 0.75)" }}>HORARIOS DE ATENCIÓN</h3>
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <h5 className="fw-semibold mb-3" style={{ color: "#fff" }}>Lunes a Viernes</h5>
                                <p className="m-0" style={{ color: "#fff" }}>09:00 a 12:00</p>
                                <p className="m-0" style={{ color: "#fff" }}>17:00 a 20:00</p>
                            </div>
                            <div className="col-md-6 mb-4">
                                <h5 className="fw-semibold mb-3" style={{ color: "#fff" }}>Sábados</h5>
                                <p className="m-0" style={{ color: "#fff" }}>09:00 a 13:00</p>
                            </div>
                        </div>

                        <h4 className="fw-bold mt-4 mb-4" style={{ color: "rgba(233, 64, 22, 0.75)" }}>CONTACTO</h4>
                        <div className="d-flex flex-column align-items-center">
                            <div style={{
                                background: "rgba(255, 255, 255, 0.9)",
                                padding: "10px",
                                borderRadius: "10px",
                                marginBottom: "20px"
                            }}>
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&format=png&color=0-0-0&data=https://wa.me/5493813199018"
                                    alt="QR WhatsApp"
                                    className="img-fluid"
                                    style={{ 
                                        width: "150px",
                                        height: "150px",
                                        borderRadius: "5px"
                                    }}
                                />
                            </div>
                            <p className="mb-2 pt-3" style={{ color: "#fff" }}>
                                Escaneá el QR para contactarnos por WhatsApp
                            </p>
                            <p className="mb-0" style={{ color: "#fff" }}>
                                📩 <strong style={{ color: "#fff" }}>Email:</strong> RollingMotor@gmail.com
                            </p>
                            <p className="mt-2" style={{ color: "#fff" }}>
                                📞 <strong style={{ color: "#fff" }}>Teléfono:</strong> +54 9 381 3905024
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contacto;