
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccessAlert = (title: string, text: string) => {
  MySwal.fire({
    title,
    text,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
};

export const showErrorAlert = (title: string, text: string) => {
  MySwal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#d33',
  });
};

export const showDeleteConfirm = (onConfirm: () => void) => {
  MySwal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esta acción!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, ¡eliminar!',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
