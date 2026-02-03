import { useProductosViewModel } from '../../../../../../ViewModels';
import ListaProductosView from './ListaProductosView';

const ListaProductosContainer = () => {
  const viewModel = useProductosViewModel();
  return <ListaProductosView {...viewModel} />;
};

export default ListaProductosContainer;
