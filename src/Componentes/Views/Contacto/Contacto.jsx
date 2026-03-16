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



        if (!nombre) {
            nuevoErrores.nombre = "Por favor ingresa tu nombre.";
        } else if (nombre.length < 3) {
            nuevoErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
        } else if (nombre.length > 12) {
            nuevoErrores.nombre = "El nombre no puede superar los 12 caracteres.";
        }



        if (!apellido) {
            nuevoErrores.apellido = "Por favor ingresa tu apellido.";
        } else if (apellido.length < 3) {
            nuevoErrores.apellido = "El apellido debe tener al menos 3 caracteres.";
        } else if (apellido.length > 12) {
            nuevoErrores.apellido = "El apellido no puede superar los 12 caracteres.";
        }



        if (!telefono) {
            nuevoErrores.telefono = "Ingresa tu número de teléfono.";
        } else if (!/^\d+$/.test(telefono)) {
            nuevoErrores.telefono = "El teléfono solo puede contener números.";
        }



        if (!email) {
            nuevoErrores.email = "Ingresa tu correo electrónico.";
        } else if (!/^[a-zA-Z0-9-_]+@gmail(\.[a-zA-Z]+)+$/i.test(email)) {
            nuevoErrores.email = "El correo solo puede ser gmail válido.";
        }



        if (!mensaje) {
            nuevoErrores.mensaje = "Escribe un mensaje para contactarnos.";
        } else if (mensaje.length > 200) {
            nuevoErrores.mensaje = "El mensaje no puede superar los 200 caracteres.";
        }



        setErrores(nuevoErrores);



        if (Object.keys(nuevoErrores).length > 0) {
            setErrorGeneral("Por favor corrige los errores antes de enviar.");
            return;
        }

        setErrorGeneral("");



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

                setErrores({
                    nombre: "",
                    apellido: "",
                    telefono: "",
                    email: "",
                    mensaje: ""
                });

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

            <div
                style={{
                    backgroundColor: "#2c2c2c",
                    minHeight: "100vh",
                    width: "100%",
                    position: "relative"
                }}
            >

                <div
                    className="container d-flex justify-content-center align-items-center min-vh-100"
                    style={{
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        padding: "20px",
                        marginTop: "50px"
                    }}
                >

                    <div
                        className="row shadow-lg rounded-4 overflow-hidden"
                        style={{
                            width: "75%",
                            maxWidth: "800px",
                            background: "rgba(214, 55, 16, 0.64)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid yellow",
                            borderRadius: "15px",
                            boxShadow: "0 0 20px rgba(255, 255, 0, 0.3)"
                        }}
                    >

                        <div
                            className="col-12 col-md-6 text-white d-flex flex-column justify-content-center p-5"
                            style={{
                                background: "rgb(0, 0, 0)",
                                backdropFilter: "blur(6px)",
                                color: "white",
                                borderRight: "1px solid rgba(255, 255, 0, 0.3)"
                            }}
                        >

                            <h2
                                className="titulo-glow"
                                style={{
                                    fontSize: "2.5rem",
                                    fontWeight: "bold"
                                }}
                            >
                                Rolling Motors
                            </h2>

                            <p
                                className="mt-3"
                                style={{
                                    color: "#ccc"
                                }}
                            >
                                Contáctanos para consultas sobre motos, repuestos y servicios.
                            </p>

                        </div>

                        <form
                            ref={form}
                            onSubmit={sendEmail}
                            className="col-12 col-md-6 d-flex flex-column justify-content-center p-5"
                            style={{
                                background: "rgba(88, 1, 1, 0.6)",
                                backdropFilter: "blur(6px)",
                                color: "white"
                            }}
                        >

                            <h5
                                className="titulo-glow2 pb-3 mb-4"
                                style={{
                                    borderBottom: "1px solid rgba(255, 255, 0, 0.3)"
                                }}
                            >
                                Datos de Contacto
                            </h5>



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
                                    border: "1px solid #eee605",
                                    color: "white",
                                    fontWeight: "600",
                                    fontSize: "1.1rem"
                                }}
                            >
                                Enviar
                            </button>



                            {errorGeneral && (

                                <div
                                    style={{
                                        color: "yellow",
                                        fontSize: "0.9rem",
                                        marginTop: "10px",
                                        textAlign: "center"
                                    }}
                                >
                                    {errorGeneral}
                                </div>

                            )}

                        </form>

                    </div>

                </div>

            </div>

        </>

    );

};

export default Contacto;