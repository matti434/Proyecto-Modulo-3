import { Form, Button, Row, Col } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { PAISES_VALIDOS } from "../../../Utils/ValidacionesForm";

import "./FormRegistro.css";

const FormRegistroView = ({

  mostrarContrasena,
  mostrarConfirmar,
  estaEnviando,
  errorGeneral,
  isValid,
  isDirty,


  nombreDeUsuario,
  email,
  contrasena,
  confirmarContrasena,


  register,
  handleSubmit,
  errors,


  toggleMostrarContrasena,
  toggleMostrarConfirmar,
  limitarCaracteres,
  limpiarErrorGeneral,


  onClose,
  onAbrirLogin,
}) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={handleSubmit} className="contenedor-formulario" noValidate>
      <div className="text-center mb-4">
        <h4 className="texto-dorado mb-0">{t("Registrarse")}</h4>
      </div>

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

      <Form.Group className="mb-4">
        <Form.Label className="form-label mb-2 texto-dorado">
          {t("Usuario")}
        </Form.Label>
        <Form.Control
          type="text"
          {...register("nombreDeUsuario")}
          maxLength={20}
          onInput={(e) => limitarCaracteres(e, 20)}
          isInvalid={!!errors.nombreDeUsuario}
          placeholder={t("usuario123 o ejemplo@correo.com")}
          className="entrada-personalizada"
        />
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.nombreDeUsuario?.message}
        </Form.Control.Feedback>
        <div className="d-flex justify-content-end mt-1">
          <small className="texto-blanco">
            {nombreDeUsuario?.length || 0}/20
          </small>
        </div>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="form-label mb-2 texto-dorado">
          {t("email")}
        </Form.Label>
        <Form.Control
          type="email"
          {...register("email")}
          maxLength={100}
          onInput={(e) => limitarCaracteres(e, 100)}
          isInvalid={!!errors.email}
          placeholder={t("ejemplo@correo.com")}
          className="entrada-personalizada"
        />
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="form-label mb-2 texto-dorado">
          {t("Pais")}
        </Form.Label>
        <Form.Select
          {...register("pais")}
          isInvalid={!!errors.pais}
          className="entrada-personalizada"
        >
          <option value="">{t("Seleccionar pais")}</option>
          {PAISES_VALIDOS.map((pais) => (
            <option key={pais} value={pais}>
              {pais}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.pais?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="form-label mb-2 texto-dorado">
          {t("Fecha de Nacimiento")}
        </Form.Label>
        <Form.Control
          type="date"
          {...register("fechaNacimiento")}
          isInvalid={!!errors.fechaNacimiento}
          className="entrada-personalizada"
          min="1955-01-01"
          max="2007-12-31"
        />
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.fechaNacimiento?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="form-label mb-0 texto-dorado">
            {t("password")}
          </Form.Label>
          <small className="texto-blanco">{contrasena?.length || 0}/50</small>
        </div>

        <div className="input-group">
          <Form.Control
            type={mostrarContrasena ? "text" : "password"}
            {...register("contrasena")}
            maxLength={50}
            onInput={(e) => limitarCaracteres(e, 50)}
            isInvalid={!!errors.contrasena}
            placeholder={t("passwordPlaceholder")}
            className="entrada-personalizada"
          />
          <button
            type="button"
            className="input-group-text"
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

      <Form.Group className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Form.Label className="form-label mb-0 texto-dorado">
            {t("Confirmar Contraseña")}
          </Form.Label>
          <small className="texto-blanco">
            {confirmarContrasena?.length || 0}/50
          </small>
        </div>

        <div className="input-group">
          <Form.Control
            type={mostrarConfirmar ? "text" : "password"}
            {...register("confirmarContrasena")}
            maxLength={50}
            onInput={(e) => limitarCaracteres(e, 50)}
            isInvalid={!!errors.confirmarContrasena}
            placeholder={t("Ingresa tu contraseña nuevamente")}
            className="entrada-personalizada"
          />
          <button
            type="button"
            className="input-group-text"
            onClick={toggleMostrarConfirmar}
            aria-label={
              mostrarConfirmar ? t("hidePassword") : t("showPassword")
            }
          >
            {mostrarConfirmar ? (
              <FaEyeSlash className="texto-dorado" />
            ) : (
              <FaEye className="texto-dorado" />
            )}
          </button>
        </div>
        <Form.Control.Feedback type="invalid" className="d-block mt-1">
          {errors.confirmarContrasena?.message}
        </Form.Control.Feedback>
      </Form.Group>

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
                {t("registering")}
              </>
            ) : (
              t("register")
            )}
          </Button>
        </Col>
      </Row>

      {onAbrirLogin && (
        <div className="text-center mt-3 pt-3 border-top border-secondary">
          <Button
            variant="outline-warning"
            type="button"
            onClick={onAbrirLogin}
            className="w-75 py-1 boton-registro"
            disabled={estaEnviando}
          >
            {t("alreadyHaveAccount")}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default FormRegistroView;
