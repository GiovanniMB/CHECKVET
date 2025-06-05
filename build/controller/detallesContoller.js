document.addEventListener("DOMContentLoaded", async () => {
    // 🔹 Obtener el ID desde la URL
    const mascotaId = window.location.pathname.split("/").pop(); // Extrae el último segmento de la URL

    if (!mascotaId || isNaN(mascotaId)) {
        console.error("ID de mascota no válido.");
        return;
    }

    try {
        // 🔹 Obtener los datos desde el Service
        const mascota = await obtenerDetalleMascota(mascotaId);
        const historial = await obtenerHistorialMascota(mascotaId);
        const enfermedad = await obtenerEnfermedad(mascotaId);
        const vacuna = await obtenerUltimaVacuna(mascotaId);
        const desparasitacion = await obtenerUltimaDesparasitacion(mascotaId);
        const vacunas = await obtenerHistorialVacunas(mascotaId);
        const desparasitaciones = await obtenerHistorialDesparasitaciones(mascotaId);

        
        document.getElementById("desparasitacion-medicamento").innerText = desparasitacion.medicamento || "No registrado";
        document.getElementById("desparasitacion-fecha").innerText = desparasitacion.fecha
            ? new Date(desparasitacion.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Sin fecha";
        document.getElementById("desparasitacion-proxima").innerText = desparasitacion.proxima_dosis
            ? new Date(desparasitacion.proxima_dosis).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Sin programación";
        document.getElementById("desparasitacion-tipo").innerText = desparasitacion.tipo || "Desconocido";
        const fechaConsulta = historial.ultimaConsulta
            ? new Date(historial.ultimaConsulta).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Sin registros";
        const enfermedadNombre = enfermedad.length > 0 ? enfermedad[0].enfermedad : "Ninguna";
        document.getElementById("vacuna-nombre").innerText = vacuna.nombre || "No registrada";
        document.getElementById("vacuna-fecha").innerText = vacuna.fecha
            ? new Date(vacuna.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Sin fecha";
        document.getElementById("vacuna-proxima").innerText = vacuna.proxima_dosis
            ? new Date(vacuna.proxima_dosis).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
            : "Sin programación";
        document.getElementById("vacuna-lab").innerText = vacuna.lab || "Sin datos";
        document.getElementById("enfermedades-historial").innerText = enfermedadNombre;
        document.getElementById("ultima-consulta").innerText = fechaConsulta;


        // 🔹 Renderizar los datos en la vista de expediente
        document.querySelector(".pet-img").src = '/' + mascota.foto || "/default.jpg";
        document.querySelector(".pet-profile-header h1").innerHTML = `<i class="bi bi-heart-pulse"></i> ${mascota.nombreMascota}`;
        document.querySelector(".col-md-4:nth-child(1) p:nth-child(1)").innerHTML = `<i class="bi bi-tag"></i> <strong>Especie:</strong> ${mascota.especie}`;
        document.querySelector(".col-md-4:nth-child(1) p:nth-child(2)").innerHTML = `<i class="bi bi-brush"></i> <strong>Raza:</strong> ${mascota.raza}`;
        document.querySelector(".col-md-4:nth-child(2) p:nth-child(1)").innerHTML = `<i class="bi bi-calendar"></i> <strong>Edad:</strong> ${mascota.edad} años`;
        document.querySelector(".col-md-4:nth-child(2) p:nth-child(2)").innerHTML = `<i class="bi bi-speedometer2"></i> <strong>Peso:</strong> ${mascota.peso} kg`;
        document.querySelector(".col-md-4:nth-child(3) p:nth-child(1)").innerHTML = `<i class="bi bi-person"></i> <strong>Dueño:</strong> ${mascota.duenioNombre}`;
        document.querySelector(".col-md-4:nth-child(3) p:nth-child(2)").innerHTML = `<i class="bi bi-telephone"></i> <strong>Teléfono:</strong> ${mascota.telefono}`;

        const tbodyv = document.getElementById("vacunas-list");
        tbodyv.innerHTML = ""; // Limpia contenido previo

        vacunas.forEach(vacuna => {
            const fechaAplicacion = new Date(vacuna.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
            const fechaProxima = vacuna.proxima_dosis
                ? new Date(vacuna.proxima_dosis).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "Sin programación";
            
            const fila = `
                <tr>
                    <td>${vacuna.nombreVac}</td>
                    <td>${fechaAplicacion}</td>
                    <td>${fechaProxima}</td>
                    <td>${vacuna.lote || "-"}</td>
                    <td>${vacuna.laboratorio || "Desconocido"}</td>
                    <td>${vacuna.notas || "-"}</td>
                </tr>
            `;

            tbodyv.innerHTML += fila;
        });
        const tbody = document.getElementById("desparasitaciones-list");
        tbody.innerHTML = ""; // Limpia contenido previo

        desparasitaciones.forEach(desparasitacion => {
            const fechaAplicacion = new Date(desparasitacion.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
            const fechaProxima = desparasitacion.proxima_dosis
                ? new Date(desparasitacion.proxima_dosis).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "Sin programación";
            
            const fila = `
                <tr>
                    <td>${desparasitacion.medicamento}</td>
                    <td>${fechaAplicacion}</td>
                    <td>${fechaProxima}</td>
                    <td>${desparasitacion.tipo || "-"}</td>
                    <td>${desparasitacion.lote || "-"}</td>
                    <td>${desparasitacion.notas || "-"}</td>
                </tr>
            `;

            tbody.innerHTML += fila;
        });

    } catch (error) {
        console.error("Error obteniendo datos de la mascota:", error);
    }
});

