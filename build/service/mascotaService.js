async function getEstados() 
{    
    const res = await fetch('/formMAscota/estados');
    const resJson = await res.json();
    return resJson;
}
async function getMunicipios(estadoId) {
    try {
        const res = await fetch(`/formMAscota/municipios/${estadoId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener municipios:", error);
        return [];
    }
}
async function getColonias(municipioId) {
    try {
        const res = await fetch(`/formMAscota/colonias/${municipioId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener colonias:", error);
        return [];
    }
}
async function getEspecies() {
    try {
        const res = await fetch('/formMAscota/especie');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener especies:", error);
        return [];
    }
}

async function getRazas(especieId) {
    try {
        const res = await fetch(`/formMAscota/raza/${especieId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener razas:", error);
        return [];
    }
}
async function verificarExistenciaCliente(curp) {
    try {
        const res = await fetch(`/formMAscota/cliente/${curp}`);
        return await res.json();
    } catch (error) {
        console.error("Error al verificar cliente:", error);
        return { existe: false };
    }
}

async function obtenerListadoMascotas() {
    try {
        const res = await fetch("/mascotas/listado");
        return await res.json();
    } catch (error) {
        console.error("Error al obtener listado de mascotas:", error);
        return [];
    }
}

 async function obtenerDetalleMascota(id) {
    try {
        const res = await fetch(`/mascotas/detalle/${id}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener detalles de la mascota:", error);
        return null;
    }
}

async function obtenerHistorialMascota(idMascota) {
    try {
        const res = await fetch(`/mascotas/ultimaCons/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el historial médico:", error);
        return null;
    }
}

async function obtenerEnfermedad(idMascota) {
    try {
        const res = await fetch(`/enfermedad/cronica/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el historial médico:", error);
        return null;
    }
}

async function obtenerUltimaVacuna(idMascota) {
    try {
        const res = await fetch(`/mascotas/vacuna/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener la última vacuna:", error);
        return null;
    }
}

async function obtenerUltimaDesparasitacion(idMascota) {
    try {
        const res = await fetch(`/mascotas/desparasitacion/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener la última desparasitación:", error);
        return null;
    }
}
async function obtenerHistorialVacunas(idMascota) {
    try {
        const res = await fetch(`/mascotas/vacunas/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el historial de vacunas:", error);
        return null;
    }
}
async function obtenerHistorialDesparasitaciones(idMascota) {
    try {
        const res = await fetch(`/mascotas/desparasitaciones/${idMascota}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener el historial de desparasitaciones:", error);
        return null;
    }
}