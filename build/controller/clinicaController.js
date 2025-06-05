document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("clinicas-list");

    try {
        const clinicas = await obtenerListadoClinicas();

        clinicas.forEach(clinica => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${clinica.nombreClinica}</td>
                <td>${clinica.estado}</td>
                <td>${clinica.municipio}</td>
                <td>${clinica.colonia}</td>
                <td class="text-center">
                    <a href="/clinicas/editar/${clinica.id}" class="btn btn-outline-primary btn-sm"><i class="bi bi-pencil"></i></a>
                    <a href="/clinicas/eliminar/${clinica.id}" class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></a>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando la vista de clínicas:", error);
    }

    // Mostrar mensaje si hubo un registro exitoso
    if (localStorage.getItem("registroExitoso") === "true") {
        const container = document.querySelector(".container");

        if (container) {
            const mensajeExito = document.createElement("div");
            mensajeExito.className = "alert alert-success mt-3 text-center";
            mensajeExito.innerText = "Registro exitoso";

            container.prepend(mensajeExito);
        }
        localStorage.removeItem("registroExitoso");
    }
});
