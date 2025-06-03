document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("mascotas-list");

    try {
        const mascotas = await obtenerListadoMascotas();

        mascotas.forEach(mascota => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.especie}</td>
                <td>${mascota.raza}</td>
                <td>${mascota.edad} años</td>
                <td>${mascota.peso} kg</td>
                <td>${mascota.duenioNombre}</td>
                <td>${mascota.sexo === 'M' ? 'Macho' : 'Hembra'}</td>
                <td>
                    <a href="/mascotas/expediente/${mascota.id}" class="btn btn-outline-primary btn-sm"><i class="bi bi-clipboard2-pulse"></i></a>
                    <a href="/mascotas/vacunas/${mascota.id}" class="btn btn-outline-secondary btn-sm"><i class="bi bi-feather2"></i></a>
                    <a href="/mascotas/desparacitacion/${mascota.id}" class="btn btn-outline-info btn-sm"><i class="bi bi-capsule-pill"></i></a>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error cargando la vista de mascotas:", error);
    }
});document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("registroExitoso") === "true") {
        
        const container = document.querySelector(".container");

        if (container) {
            
            const mensajeExito = document.createElement("div");
            mensajeExito.className = "alert alert-success mt-3 text-center";
            mensajeExito.innerText = " Registro exitoso";

            
            container.prepend(mensajeExito);
        }
        localStorage.removeItem("registroExitoso");
    }
});