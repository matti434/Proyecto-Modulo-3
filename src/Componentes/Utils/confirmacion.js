import Swal from 'sweetalert2';

// Alerta de confirmación (reemplaza a window.confirm)
export const confirmarAccion = async (titulo, texto) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b77702',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    background: '#0c0c0c',
    color: '#c69b0c'
  });

  return result.isConfirmed;
};
