document.addEventListener("DOMContentLoaded", async () => {
    const tbody = document.getElementById("mis-mascotas-list");
    
    const curp = document.body.getAttribute("data-curp"); 

    if (!curp) {
        console.error("⛔ No se pudo obtener el CURP del usuario.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/misMascotas", {
            method: "POST", 
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ curp })
        });

        const data = await response.json();
        const mascotas = data.mascotas;

        mascotas.forEach(mascota => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${mascota.nombreMascota}</td>
                <td>${mascota.especie}</td>
                <td>${mascota.raza}</td>
                <td>${mascota.edad} años</td>
                <td>${mascota.peso} kg</td>
                <td>${mascota.sexo === 'M' ? 'Macho' : 'Hembra'}</td>
                <td class="text-center">
                    <a href="/mascota/${mascota.id}" class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-clipboard2-pulse"></i>
                    </a>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
    }
});