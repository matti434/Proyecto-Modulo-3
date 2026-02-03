import React, { useState, useEffect } from "react";

/**
  View pura para el modal de editar usuario
  Solo recibe props y renderiza UI
 */
export const ModalEditarUsuarioView = ({ usuario, onGuardar, onCancelar }) => {
  const [datosFormulario, setDatosFormulario] = useState({
    nombreDeUsuario: usuario?.nombreDeUsuario || "",
    email: usuario?.email || "",
    pais: usuario?.pais || "",
    fechaNacimiento: usuario?.fechaNacimiento || "",
  });

  useEffect(() => {
    if (usuario) {
      setDatosFormulario({
        nombreDeUsuario: usuario.nombreDeUsuario,
        email: usuario.email,
        pais: usuario.pais,
        fechaNacimiento: usuario.fechaNacimiento,
      });
    }
  }, [usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(datosFormulario);
  };

  return (
    <div className="superposicion-formulario">
      <div className="contenedor-formulario">
        <h3>Editar Usuario</h3>
        <form onSubmit={handleSubmit}>
          <div className="campo-formulario">
            <label htmlFor="nombreUsuario">Nombre de usuario *</label>
            <input
              id="nombreUsuario"
              type="text"
              value={datosFormulario.nombreDeUsuario}
              onChange={(e) =>
                setDatosFormulario({
                  ...datosFormulario,
                  nombreDeUsuario: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="emailUsuario">Email *</label>
            <input
              id="emailUsuario"
              type="email"
              value={datosFormulario.email}
              onChange={(e) =>
                setDatosFormulario({
                  ...datosFormulario,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="paisUsuario">País *</label>
            <input
              id="paisUsuario"
              type="text"
              value={datosFormulario.pais}
              onChange={(e) =>
                setDatosFormulario({
                  ...datosFormulario,
                  pais: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="campo-formulario">
            <label htmlFor="fechaNacimiento">Fecha de nacimiento *</label>
            <input
              id="fechaNacimiento"
              type="date"
              value={datosFormulario.fechaNacimiento}
              onChange={(e) =>
                setDatosFormulario({
                  ...datosFormulario,
                  fechaNacimiento: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="botones-formulario">
            <button type="submit" className="boton-guardar">
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
