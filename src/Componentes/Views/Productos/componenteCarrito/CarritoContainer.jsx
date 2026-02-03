import { useCarritoViewModel } from '../../../../ViewModels';
import CarritoView from './CarritoView';

const CarritoContainer = () => {
  const viewModel = useCarritoViewModel();
  return <CarritoView {...viewModel} />;
};

export default CarritoContainer;
