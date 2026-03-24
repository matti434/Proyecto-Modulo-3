import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editarUsuarioSchema, PAISES_VALIDOS, LIMITES } from "../Utils/ValidacionesForm";

const L = LIMITES.usuario;


export const ModalEditarUsuarioView = ({ usuario, onGuardar, onCancelar }) => {
  const defaultValues = {
    nombreDeUsuario: usuario?.nombreDeUsuario || "",
    email: usuario?.email || "",
    pais: usuario?.pais || "",
    fechaNacimiento: usuario?.fechaNacimiento
      ? new Date(usuario.fechaNacimiento).toISOString().slice(0, 10)
      : "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(editarUsuarioSchema),
    mode: "onChange",
    defaultValues,
  });

  useEffect(() => {
    if (usuario) {
      reset({
        nombreDeUsuario: usuario.nombreDeUsuario,
        email: usuario.email,
        pais: usuario.pais || "",
        fechaNacimiento: usuario.fechaNacimiento
          ? new Date(usuario.fechaNacimiento).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [usuario, reset]);

  const onSubmit = (data) => {
    onGuardar(data);
  };

  return (
    <div className="superposicion-formulario">
      <div className="contenedor-formulario">
        <h3>Editar Usuario</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="campo-formulario">
            <label htmlFor="nombreUsuario">Nombre de usuario</label>
            <input
              id="nombreUsuario"
              type="text"
              {...register("nombreDeUsuario")}
              maxLength={L.nombreDeUsuario}
              className={errors.nombreDeUsuario ? "input-invalido" : ""}
              aria-invalid={!!errors.nombreDeUsuario}
            />
            {errors.nombreDeUsuario && (
              <span className="mensaje-error-formulario" role="alert">
                {errors.nombreDeUsuario.message}
              </span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="emailUsuario">Email</label>
            <input
              id="emailUsuario"
              type="email"
              {...register("email")}
              maxLength={L.email}
              className={errors.email ? "input-invalido" : ""}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span className="mensaje-error-formulario" role="alert">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="paisUsuario">País</label>
            <select
              id="paisUsuario"
              {...register("pais")}
              className={errors.pais ? "input-invalido" : ""}
              aria-invalid={!!errors.pais}
            >
              <option value="">Seleccione un país</option>
              {PAISES_VALIDOS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {errors.pais && (
              <span className="mensaje-error-formulario" role="alert">
                {errors.pais.message}
              </span>
            )}
          </div>

          <div className="campo-formulario">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
            <input
              id="fechaNacimiento"
              type="date"
              {...register("fechaNacimiento")}
              className={errors.fechaNacimiento ? "input-invalido" : ""}
              aria-invalid={!!errors.fechaNacimiento}
            />
            {errors.fechaNacimiento && (
              <span className="mensaje-error-formulario" role="alert">
                {errors.fechaNacimiento.message}
              </span>
            )}
          </div>

          <div className="botones-formulario">
            <button
              type="submit"
              className="boton-guardar"
              disabled={!isValid}
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onCancelar}
              className="boton-cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
