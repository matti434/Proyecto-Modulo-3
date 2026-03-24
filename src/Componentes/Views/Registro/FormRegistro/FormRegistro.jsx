import { useFormRegistroViewModel } from "./useFormRegistroViewModel";
import FormRegistroView from "./FormRegistroView";

const FormRegistro = ({ onSubmit, onClose, onAbrirLogin }) => {
  const viewModel = useFormRegistroViewModel({ onSubmit, onClose, onAbrirLogin });
  return <FormRegistroView {...viewModel} />;
};

export default FormRegistro;
