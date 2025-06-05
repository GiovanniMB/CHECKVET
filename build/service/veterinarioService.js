/*async function getEstados() {    
    const res = await fetch('/formVet/estados');
    const resJson = await res.json();
    return resJson;
}

async function getMunicipios(estadoId) {
    try {
        const res = await fetch(`/formVet/municipios/${estadoId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener municipios:", error);
        return [];
    }
}

async function getColonias(municipioId) {
    try {
        const res = await fetch(`/formVet/colonias/${municipioId}`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return await res.json();
    } catch (error) {
        console.error("Error al obtener colonias:", error);
        return [];
    }
}*/

// veterinarioService.js
export async function getEstados() {
    const res = await fetch("http://localhost:4000/formMascota/estados");
    if (!res.ok) throw new Error("Error Estados: " + res.status);
    return res.json();
}

export async function getMunicipios(idEstado) {
    const res = await fetch(`http://localhost:4000/formMascota/municipios/${idEstado}`);
    if (!res.ok) throw new Error("Error Municipios: " + res.status);
    return res.json();
}

export async function getColonias(idMunicipio) {
    const res = await fetch(`http://localhost:4000/formMascota/colonias/${idMunicipio}`);
    if (!res.ok) throw new Error("Error Colonias: " + res.status);
    return res.json();
}


async function obtenerListadoVeterinarios() {
    try {
        const res = await fetch("/veterinarios");
        return await res.json();
    } catch (error) {
        console.error("Error al obtener listado de veterinarios:", error);
        return [];
    }
}



