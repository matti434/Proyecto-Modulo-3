import "../../estilos/variables.css";

import { AdminFormularioView } from "./AdminFormularioView";
import { AdminHomeView } from "./AdminHomeView";
import { AdminPedidosView } from "./AdminPedidosView";
import { AdminProductosView } from "./AdminProductosView";
import { AdminRecomendacionesView } from "./AdminRecomendacionesView";
import { AdminSuspendidosView } from "./AdminSuspendidosView";
import { AdminUsuariosView } from "./AdminUsuariosView";
import MapaUsuarios from "./MapaUsuarios";
import { ModalEditarUsuarioView } from "./ModalEditarUsuarioView";

import "./AdminPanel.css";


export const AdminPanelView = ({
  
  usuarios,
  usuariosSuspendidos,
  productos,
  esAdministrador,
  cargando,
  estadisticas,


  vistaActiva,
  usuarioEditando,
  productoEditando,
  mostrarFormProducto,
  modoFormularioProducto,
  pedidos,
  pedidosCargando,
  pedidoActual,
  modoPedido,
  mostrarFormPedido,
  enviandoPedido,

  datosFormularioProducto,
  errorImagenProducto,
  enviandoFormularioProducto,
  subiendoImagenProducto,
  errorUploadImagen,
  erroresFormularioProducto,
  erroresPedido,

 
  totalAdmins,
  totalUsuarios,
  totalNormales,
  totalSuspendidos,
  suspendidosMas30Dias,
  valorTotalProductos,

  
  onCambiarVista,
  onSincronizar,
  onEditarUsuario,
  onSuspenderUsuario,
  onReactivarUsuario,
  onEliminarUsuarioSuspendido,
  onAbrirFormularioProducto,
  onEditarProducto,
  onEliminarProducto,
  onGuardarUsuario,
  onCancelarEdicionUsuario,
  onGuardarProducto,
  onCancelarFormularioProducto,
  onCambioCampoFormulario,
  onErrorImagen,
  onArchivoSeleccionado,
  onPedidoActualChange,
  onPedidoCampoChange,
  onGuardarPedido,
  onAbrirFormPedido,
  onCerrarFormPedido,
  onEditarPedido,
  onEliminarPedido,
  onActualizarEstadoPedido,

  contenidoHome,
  contenidoHomeCargando,
  contenidoHomeError,
  portadaSubiendo,
  galeriaSubiendo,
  galeriaActualizandoId,
  onSubirPortada,
  onAgregarImagenGaleria,
  onActualizarTextoGaleria,
  onReemplazarImagenGaleria,
  onEliminarImagenGaleria,
}) => {
  if (!esAdministrador) {
    return (
      <div className="panel-administracion">
        <div className="acceso-denegado">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  if (cargando && vistaActiva === "productos") {
    return (
      <div className="panel-administracion">
        <div className="cargando">
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (contenidoHomeCargando && vistaActiva === "home") {
    return (
      <div className="panel-administracion">
        <div className="cargando">
          <p>Cargando contenido de inicio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-administracion">
      <header className="encabezado-administracion">
        <h1>Panel de Administración</h1>
        <nav className="navegacion-administracion">
          <button
            className={vistaActiva === "usuarios" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("usuarios")}
          >
            👤 Usuarios ({usuarios.length})
          </button>

          <button
            className={vistaActiva === "suspendidos" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("suspendidos")}
          >
            ⚠️ Suspendidos ({usuariosSuspendidos.length})
          </button>

          <button
            className={vistaActiva === "productos" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("productos")}
          >
            📦 Productos ({productos.length})
          </button>

          <button
            className={vistaActiva === "home" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("home")}
          >
            🏠 Inicio
          </button>

          <button
            className={vistaActiva === "mapa" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("mapa")}
          >
            🌍 Mapa
          </button>
          <button
            className={vistaActiva === "pedidos" ? "btn-activo" : ""}
            onClick={() => onCambiarVista("pedidos")}
          >
            📦 Pedidos
          </button>
          
        </nav>

        <div className="controles-encabezado">
          <button className="boton-sincronizar" onClick={onSincronizar}>
            🔄 Sincronizar con API
          </button>
        </div>
      </header>

      {vistaActiva === "usuarios" && (
        <AdminUsuariosView
          usuarios={usuarios}
          totalAdmins={totalAdmins}
          totalUsuarios={totalUsuarios}
          totalNormales={totalNormales}
          onEditarUsuario={onEditarUsuario}
          onSuspenderUsuario={onSuspenderUsuario}
        />
      )}

      {vistaActiva === "suspendidos" && (
        <AdminSuspendidosView
          usuariosSuspendidos={usuariosSuspendidos}
          totalSuspendidos={totalSuspendidos}
          suspendidosMas30Dias={suspendidosMas30Dias}
          onReactivarUsuario={onReactivarUsuario}
          onEliminarUsuarioSuspendido={onEliminarUsuarioSuspendido}
        />
      )}

      {vistaActiva === "productos" && (
        <AdminProductosView
          productos={productos}
          estadisticas={estadisticas}
          valorTotalProductos={valorTotalProductos}
          onAbrirFormulario={onAbrirFormularioProducto}
          onEditarProducto={onEditarProducto}
          onEliminarProducto={onEliminarProducto}
        />
      )}

      {vistaActiva === "pedidos" && (
        <AdminPedidosView
          pedidos={pedidos}
          pedidosCargando={pedidosCargando}
          pedidoActual={pedidoActual}
          erroresPedido={erroresPedido}
          mostrarFormPedido={mostrarFormPedido}
          enviandoPedido={enviandoPedido}
          onActualizarEstadoPedido={onActualizarEstadoPedido}
          onPedidoCampoChange={onPedidoCampoChange}
          onGuardarPedido={onGuardarPedido}
          onAbrirFormPedido={onAbrirFormPedido}
          onCerrarFormPedido={onCerrarFormPedido}
        />
      )}

      {vistaActiva === "home" && (
        <AdminHomeView
          portadaImagenUrl={contenidoHome?.portada?.imagenUrl}
          galeria={contenidoHome?.galeria ?? []}
          portadaSubiendo={portadaSubiendo}
          galeriaSubiendo={galeriaSubiendo}
          galeriaActualizandoId={galeriaActualizandoId}
          errorHome={contenidoHomeError}
          onSubirPortada={onSubirPortada}
          onAgregarImagenGaleria={onAgregarImagenGaleria}
          onActualizarTextoGaleria={onActualizarTextoGaleria}
          onReemplazarImagenGaleria={onReemplazarImagenGaleria}
          onEliminarImagenGaleria={onEliminarImagenGaleria}
        />
      )}

      {vistaActiva === "mapa" && <MapaUsuarios usuarios={usuarios} />}

      {usuarioEditando && (
        <ModalEditarUsuarioView
          usuario={usuarioEditando}
          onGuardar={onGuardarUsuario}
          onCancelar={onCancelarEdicionUsuario}
        />
      )}

      {mostrarFormProducto && (
        <AdminFormularioView
          modo={modoFormularioProducto}
          datosFormulario={datosFormularioProducto}
          errorImagen={errorImagenProducto}
          enviando={enviandoFormularioProducto}
          subiendoImagen={subiendoImagenProducto}
          errorUploadImagen={errorUploadImagen}
          errores={erroresFormularioProducto}
          onGuardar={onGuardarProducto}
          onCancelar={onCancelarFormularioProducto}
          onCambioCampo={onCambioCampoFormulario}
          onErrorImagen={onErrorImagen}
          onArchivoSeleccionado={onArchivoSeleccionado}
        />
      )}
    </div>
  );
};
