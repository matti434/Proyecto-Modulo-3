import Swal from 'sweetalert2';

// Alerta de confirmación (reemplaza a window.confirm)
export const confirmarAccion = async (titulo, texto) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1a1a1a', // Negro motorista
    cancelButtonColor: '#d33',     // Rojo alerta
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,          // Pone el 'Confirmar' a la derecha
    background: '#ffffff',
    color: '#000000'
  });

  return result.isConfirmed;
};
