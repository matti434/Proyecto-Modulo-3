import React from 'react';
import "../../estilos/variables.css";
import "./AdminPanel.css";
import { AdminUsuariosView } from './AdminUsuariosView';
import { AdminSuspendidosView } from './AdminSuspendidosView';
import { AdminProductosView } from './AdminProductosView';
import { AdminPedidosView } from './AdminPedidosView';
import { AdminFormularioView } from './AdminFormularioView';
import { ModalEditarUsuarioView } from './ModalEditarUsuarioView';
import MapaUsuarios from './MapaUsuarios';

/**
 View pura principal del AdminPanel
  Solo recibe props y renderiza UI
  NO tiene lógica, NO usa hooks de negocio
 */
export const AdminPanelView = ({
  // Datos del Context
  usuarios,
  usuariosSuspendidos,
  productos,
  esAdministrador,
  cargando,
  estadisticas,

  // Estado local
  vistaActiva,
  usuarioEditando,
  productoEditando,
  mostrarFormProducto,
  modoFormularioProducto,
  pedidos,
  pedidoActual,
  modoPedido,
  // Estado del formulario de producto
  datosFormularioProducto,
  errorImagenProducto,
  enviandoFormularioProducto,
  erroresFormularioProducto,
  erroresPedido,

  // Valores calculados
  totalAdmins,
  totalUsuarios,
  totalNormales,
  totalSuspendidos,
  suspendidosMas30Dias,
  valorTotalProductos,

  // Funciones
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
  onPedidoActualChange,
  onPedidoCampoChange,
  onGuardarPedido,
  onEditarPedido,
  onEliminarPedido,
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
          pedidoActual={pedidoActual}
          modoPedido={modoPedido}
          errores={erroresPedido}
          onPedidoCampoChange={onPedidoCampoChange}
          onGuardarPedido={onGuardarPedido}
          onEditarPedido={onEditarPedido}
          onEliminarPedido={onEliminarPedido}
        />
      )}

      {vistaActiva === "mapa" && <MapaUsuarios />}

      
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
          errores={erroresFormularioProducto}
          onGuardar={onGuardarProducto}
          onCancelar={onCancelarFormularioProducto}
          onCambioCampo={onCambioCampoFormulario}
          onErrorImagen={onErrorImagen}
        />
      )}
    </div>
  );
};
