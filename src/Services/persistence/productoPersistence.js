const STORAGE_KEY = "productos";

export const obtenerTodos = () => {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
};

export const guardar = (productos) => {
    localStorage.setItem(STORAGE_KEY,JSON.stringify(productos));
};

export const obtenerPorId = (id) =>{
    return obtenerTodos().find(u => u.id === id);
}

export const agregar = (producto) => {
    const productos = obtenerTodos();
    productos.push(producto);
    guardar(productos);
    return { exito: true, producto };
}

export const editar = (id, datosActualizados) => {
    const productos = obtenerTodos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return { exito: false, mensaje: "Producto no encontrado" };
    
    productos[index] = { ...productos[index], ...datosActualizados };
    guardar(productos);
    return { exito: true, producto: productos[index] };
  };
  
  export const eliminar = (id) => {
    const productos = obtenerTodos();
    const nuevos = productos.filter(p => p.id !== id);
    if (productos.length === nuevos.length) {
      return { exito: false, mensaje: "Producto no encontrado" };
    }
    guardar(nuevos);
    return { exito: true };
  };
  
  export const obtenerDestacados = () => {
    return obtenerTodos().filter(p => p.destacado);
  };
  
  export const obtenerConStock = () => {
    return obtenerTodos().filter(p => p.stock);
  };
  
  export const obtenerRecientes = (limite = 5) => {
    return [...obtenerTodos()]
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, limite);
  };