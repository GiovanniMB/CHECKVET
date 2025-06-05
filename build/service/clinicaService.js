async function obtenerListadoClinicas() {
    try {
        const res = await fetch("/clinica/listado");
        return await res.json();
    } catch (error) {
        console.error("Error al obtener listado de clínicas:", error);
        return [];
    }
}
