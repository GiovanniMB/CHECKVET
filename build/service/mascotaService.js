async function getEstados() {    
    const res = await fetch('/formMascota/estados');
    const resJson = await res.json();
    return resJson;
}

async function getMunicipios(estadoId) {
    try {
        const res = await fetch(`/formMascota/municipios/${estadoId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener municipios:", error);
        return [];
    }
}

async function getColonias(municipioId) {
    try {
        const res = await fetch(`/formMascota/colonias/${municipioId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener colonias:", error);
        return [];
    }
}

async function getEspecies() {
    try {
        const res = await fetch('/formMascota/especie');
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener especies:", error);
        return [];
    }
}

async function getRazas(especieId) {
    try {
        const res = await fetch(`/formMascota/raza/${especieId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener razas:", error);
        return [];
    }
}

async function verificarExistenciaCliente(curp) {
    try {
        const res = await fetch(`/formMascota/cliente/${curp}`);
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
