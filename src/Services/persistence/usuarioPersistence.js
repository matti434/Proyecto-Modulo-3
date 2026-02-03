const STORAGE_KEY = "usuarios";
const SUSPENDED_KEY = "usuariosSuspendidos";


export const obtenerTodos = () => {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? JSON.parse(datos) : [];
};

export const guardar = (usuarios) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
};

export const obtenerPorId = (id) => {
    return obtenerTodos().find(u => u.id === id);
};

export const agregar = (usuario) => {
    const usuarios = obtenerTodos();
    usuarios.push(usuario);
    guardar(usuarios);
    return { exito: true, usuario };
};

export const editar = (id, datosActualizados) => {
    const usuarios = obtenerTodos();
    const index = usuarios.findIndex(u => u.id === id);

    if (index === -1) return { exito: false, mensaje: "Usuario no encontrado" };

    usuarios[index] = { ...usuarios[index], ...datosActualizados };
    guardar(usuarios);
    return { exito: true, usuario: usuarios[index] };
};

export const eliminar = (id) => {
    const usuarios = obtenerTodos();
    const nuevos = usuarios.filter(u => u.id !== id);
    if (nuevos.length === usuarios.length) {
        return { exito: false, mensaje: "Usuario no encontrado" }
    }
    guardar(nuevos);
    return { exito: true };
};

export const obtenerSuspendidos = () => {
    const datos = localStorage.getItem(SUSPENDED_KEY);
    return datos ? JSON.parse(datos) : [];
};

export const buscar = (termino) => {
    const usuarios = obtenerTodos();
    if (!termino || termino.trim() === '') return usuarios;
    
    const busqueda = termino.toLowerCase();
    return usuarios.filter(u => 
        u.nombreDeUsuario?.toLowerCase().includes(busqueda) ||
        u.email?.toLowerCase().includes(busqueda) ||
        u.pais?.toLowerCase().includes(busqueda)
    );
};

export const guardarSuspendidos = (usuariosSuspendidos) => {
    localStorage.setItem(SUSPENDED_KEY, JSON.stringify(usuariosSuspendidos));
};

export const moverASuspendidos = (id, fechaSuspension = new Date().toISOString()) => {
    const usuarios = obtenerTodos();
    const suspendidos = obtenerSuspendidos();

    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return { exito: false, mensaje: "Usuario no encontrado" };

    const usuario = { ...usuarios[index], fechaSuspension };
    suspendidos.push(usuario);
    usuarios.splice(index, 1);

    guardar(usuarios);
    guardarSuspendidos(suspendidos);
    return { exito: true, usuario };
};

export const reactivar = (id) => {
    const usuarios = obtenerTodos();
    const suspendidos = obtenerSuspendidos();
    const index = suspendidos.findIndex(u => u.id === id);

    if (index === -1) {
        return { exito: false, mensaje: "Usuario suspendido no encontrado" };
    }

    const usuario = { ...suspendidos[index] };
    delete usuario.fechaSuspension;
    
    usuarios.push(usuario);
    suspendidos.splice(index, 1);
    
    guardar(usuarios);
    guardarSuspendidos(suspendidos);
    return { exito: true, usuario };
};

export const eliminarSuspendido = (id) => {
    const suspendidos = obtenerSuspendidos();
    const index = suspendidos.findIndex(u => u.id === id);

    if(index === -1) {
        return {
            exito:false, mensaje: "Usuario suspendido no encontrado"
        }
    }

    suspendidos.splice(index,1);
    guardarSuspendidos(suspendidos);
    return {exito:true};
}