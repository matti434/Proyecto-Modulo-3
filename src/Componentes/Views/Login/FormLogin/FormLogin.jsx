import { useFormLoginViewModel } from "./useFormLoginViewModel";
import FormLoginView from "./FormLoginView";

const FormLogin = ({ onSubmit, onClose, onAbrirRegistro }) => {
  const viewModel = useFormLoginViewModel({ onSubmit, onClose, onAbrirRegistro });
  return <FormLoginView {...viewModel} />;
};

export default FormLogin;
