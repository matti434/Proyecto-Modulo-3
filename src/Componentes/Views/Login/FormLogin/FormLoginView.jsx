import { Form, Button, Row, Col } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import "./FormLogin.css";

const FormLoginView = ({
  // Estado
  mostrarContrasena,
  estaEnviando,
  errorGeneral,
  isValid,
  isDirty,

  // Valores observados
  credencial,
  contrasena,

  // Funciones de formulario
  register,
  handleSubmit,
  errors,

  // Funciones de UI
  toggleMostrarContrasena,
  limitarCaracteres,
  limpiarErrorGeneral,
  manejarClickRegistro,

  // Callbacks
  onClose,
}) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit} className="contenedor-formulario" noValidate>
      {errorGeneral && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          {errorGeneral}
          <button
            type="button"
            className="btn-close"
            onClick={limpiarErrorGeneral}
            aria-label={t("close")}
          ></button>
        </div>
      )}

      <Form.Group className="mb-2">
        <Form.Label className="form-label mb-1 texto-dorado">
          {t("usernameOrEmail")}
        </Form.Label>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-transparent border-end-0">
            <FaUser className="texto-dorado" />
          </span>
          <Form.Control
            type="text"
            {...register("credencial")}
            maxLength={100}
            onInput={(e) => limitarCaracteres(e, 100)}
            isInvalid={!!errors.credencial}
            placeholder={t("usernameOrEmailPlaceholder")}
            className="entrada-personalizada border-start-0"
          />
        </div>
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.credencial?.message}
        </Form.Control.Feedback>
        <div className="d-flex justify-content-end mt-1">
          <small className="texto-blanco">{credencial?.length || 0}/100</small>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <Form.Label className="form-label mb-0 texto-dorado">
            {t("password")}
          </Form.Label>
          <small className="texto-blanco">{contrasena?.length || 0}/50</small>
        </div>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-transparent border-end-0">
            <FaLock className="texto-dorado" />
          </span>
          <Form.Control
            type={mostrarContrasena ? "text" : "password"}
            {...register("contrasena")}
            maxLength={50}
            onInput={(e) => limitarCaracteres(e, 50)}
            isInvalid={!!errors.contrasena}
            placeholder={t("passwordPlaceholder")}
            className="entrada-personalizada border-start-0"
          />
          <button
            type="button"
            className="input-group-text bg-transparent border-start-0"
            onClick={toggleMostrarContrasena}
            aria-label={
              mostrarContrasena ? t("hidePassword") : t("showPassword")
            }
          >
            {mostrarContrasena ? (
              <FaEyeSlash className="texto-dorado" />
            ) : (
              <FaEye className="texto-dorado" />
            )}
          </button>
        </div>
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.contrasena?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="text-end mb-4">
        <a
          href="#"
          className="enlace-dorado text-decoration-none"
          onClick={(e) => e.preventDefault()}
        >
          {t("forgotPassword")}
        </a>
      </div>

      <Row className="g-3 mt-4">
        <Col xs={12} sm={6}>
          <Button
            variant="outline-light"
            onClick={onClose}
            type="button"
            className="w-100 py-3 boton-personalizado boton-cancelar"
            disabled={estaEnviando}
          >
            {t("cancel")}
          </Button>
        </Col>
        <Col xs={12} sm={6}>
          <Button
            variant="warning"
            type="submit"
            className="w-100 py-3 boton-personalizado boton-enviar"
            disabled={estaEnviando || !isValid || !isDirty}
          >
            {estaEnviando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {t("loggingIn")}
              </>
            ) : (
              t("login")
            )}
          </Button>
        </Col>
      </Row>

      <div className="text-center mt-3 pt-3 border-top border-secondary">
        <Button
          variant="outline-warning"
          onClick={manejarClickRegistro}
          className="w-75 py-1 boton-registro"
          disabled={estaEnviando}
        >
          {t("createAccount")}
        </Button>
      </div>
    </Form>
  );
};

export default FormLoginView;
