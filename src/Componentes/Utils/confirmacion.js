import Swal from 'sweetalert2';
import './confirmacion.css';

// Alerta de confirmación (reemplaza a window.confirm)
export const confirmarAccion = async (titulo, texto) => {
  const result = await Swal.fire({
    title: titulo,
    text: texto,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,

    customClass: {
      container: 'swal-custom-container',
      popup: 'swal-custom-popup',
      title: 'swal-custom-title',
      confirmButton: 'swal-custom-confirm',
      cancelButton: 'swal-custom-cancel'
    },
      buttonsStyling: false // Importante para que no use los estilos por defecto de SweetAlert
  });

  return result.isConfirmed;
};
