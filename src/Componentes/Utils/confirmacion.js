import Swal from 'sweetalert2';

// Alerta de confirmación (reemplaza a window.confirm)
export const confirmarAccion = async (titulo, texto) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b77702', // Negro motorista
    cancelButtonColor: '#d33',     // Rojo alerta
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,          // Pone el 'Confirmar' a la derecha
    background: '#0c0c0c',
    color: '#c69b0c'
  });

  return result.isConfirmed;
};
