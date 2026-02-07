import { createContext, useContext, useState, useEffect } from 'react';

const ContextoFavoritos = createContext();

export const useFavoritos = () => {
  const context = useContext(ContextoFavoritos);
  if (!context) throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  return context;
};

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const toggleFavorito = (productoId) => {
    setFavoritos(prev => 
      prev.includes(productoId) 
        ? prev.filter(id => id !== productoId)
        : [...prev, productoId]
    );
  };

  const esFavorito = (productoId) => favoritos.includes(productoId);

  return (
    <ContextoFavoritos.Provider value={{ favoritos, toggleFavorito, esFavorito }}>
      {children}
    </ContextoFavoritos.Provider>
  );
};
