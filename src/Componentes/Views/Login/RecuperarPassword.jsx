import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./RecuperarPassword.css";

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 50;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
const PASSWORD_MSG = "Mayúscula, minúscula, número y un símbolo";
const API_URL = import.meta.env.VITE_API_URL || "";

export default function RecuperarPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1);
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info"); // "info" | "success" | "danger"
  const [errorNuevaPassword, setErrorNuevaPassword] = useState("");
  const [errorConfirmarPassword, setErrorConfirmarPassword] = useState("");

  const limpiarMensaje = () => {
    setMensaje(null);
  };

  // ----- Paso 1: Enviar código -----
  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    limpiarMensaje();
    if (!email.trim()) return;
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/auth/recuperar-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const contentType = res.headers.get("content-type");
      const data =
        contentType && contentType.includes("application/json")
          ? await res.json().catch(() => ({}))
          : {};
      if (!res.ok) {
        setTipoMensaje("danger");
        if (res.status === 500) {
          setMensaje(
            data?.message ||
              "Error en el servidor al enviar el código. Revisa que el backend esté corriendo y configurado (env, email). Intenta más tarde.",
          );
        } else {
          setMensaje(
            data?.message || "Error al enviar el código. Intenta de nuevo.",
          );
        }
        return;
      }
      setTipoMensaje("info");
      setMensaje(
        data?.message ||
          "Si el email está registrado, recibirás un código por correo.",
      );
      setPaso(2);
    } catch (err) {
      setTipoMensaje("danger");
      setMensaje("Error de conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const validarNuevaContrasena = () => {
    setErrorNuevaPassword("");
    setErrorConfirmarPassword("");
    let valido = true;
    if (nuevaPassword.length < PASSWORD_MIN) {
      setErrorNuevaPassword("Mínimo 8 caracteres");
      valido = false;
    } else if (nuevaPassword.length > PASSWORD_MAX) {
      setErrorNuevaPassword("Máximo 50 caracteres");
      valido = false;
    } else if (!PASSWORD_REGEX.test(nuevaPassword)) {
      setErrorNuevaPassword(PASSWORD_MSG);
      valido = false;
    }
    if (nuevaPassword !== confirmarPassword) {
      setErrorConfirmarPassword("Las contraseñas no coinciden");
      valido = false;
    }
    return valido;
  };

  // ----- Paso 2: Restablecer contraseña -----
  const handleRestablecer = async (e) => {
    e.preventDefault();
    limpiarMensaje();
    if (nuevaPassword !== confirmarPassword) {
      setTipoMensaje("danger");
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
    if (nuevaPassword.length < 8) {
      setTipoMensaje("danger");
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setCargando(true);
    try {
      const res = await fetch(`${API_URL}/auth/restablecer-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          codigo: codigo.trim(),
          nuevaPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTipoMensaje("danger");
        setMensaje(
          data?.message || "Código inválido o expirado. Intenta de nuevo.",
        );
        return;
      }
      if (data.exito === true) {
        setTipoMensaje("success");
        setMensaje(data?.message || "Contraseña actualizada. Redirigiendo...");
        setTimeout(() => navigate("/"), 2000);
        return;
      }
      setTipoMensaje("danger");
      setMensaje(data?.message || "No se pudo restablecer la contraseña.");
    } catch (err) {
      setTipoMensaje("danger");
      setMensaje("Error de conexión. Revisa tu internet e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container py-5 pagina-recuperar-password mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4">{t("forgotPassword")}</h2>

          {mensaje && (
            <Alert
              variant={tipoMensaje}
              dismissible
              onClose={limpiarMensaje}
              className="mb-4"
            >
              {mensaje}
            </Alert>
          )}

          {paso === 1 && (
            <Form onSubmit={handleEnviarCodigo}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </Form.Group>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => navigate(-1)}
                  disabled={cargando}
                >
                  Volver
                </Button>
                <Button type="submit" variant="warning" disabled={cargando}>
                  {cargando ? "Enviando..." : "Enviar código"}
                </Button>
              </div>
            </Form>
          )}

          {paso === 2 && (
            <Form onSubmit={handleRestablecer}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Código (6 dígitos)</Form.Label>
                <Form.Control
                  type="text"
                  value={codigo}
                  onChange={(e) =>
                    setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={nuevaPassword}
                  onChange={(e) => setNuevaPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />
              </Form.Group>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => setPaso(1)}
                  disabled={cargando}
                >
                  Volver al paso 1
                </Button>
                <Button type="submit" variant="warning" disabled={cargando}>
                  {cargando ? "Guardando..." : "Restablecer contraseña"}
                </Button>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
