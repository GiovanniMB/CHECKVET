// public/js/registroClinica.js
function mostrarError(mensaje) {
    const alerta = document.createElement("div");
    alerta.className = "alert alert-danger mt-3";
    alerta.textContent = mensaje;
    document.body.prepend(alerta);
}

document.addEventListener("DOMContentLoaded", async () => {
    const estadoSelect = document.getElementById("estado");
    const municipioSelect = document.getElementById("Municipio");
    const coloniaSelect = document.getElementById("Colonia");

    municipioSelect.disabled = true;
    coloniaSelect.disabled = true;

    // Cargar estados
    try {
        const estados = await fetch("/clinicas/estados").then(r => r.json());
        estados.forEach(e => {
            estadoSelect.innerHTML += `<option value="${e.id}">${e.nombre}</option>`;
        });
    } catch (err) {
        console.error("Error al cargar estados:", err);
    }

    estadoSelect.addEventListener("change", async () => {
        const idEstado = estadoSelect.value;

        municipioSelect.innerHTML = `<option selected disabled>Seleccione un municipio</option>`;
        coloniaSelect.innerHTML = `<option selected disabled>Seleccione una colonia</option>`;
        municipioSelect.disabled = true;
        coloniaSelect.disabled = true;

        if (!idEstado) return;

        try {
            const municipios = await fetch(`/clinicas/municipios/${idEstado}`).then(r => r.json());
            municipios.forEach(m => {
                municipioSelect.innerHTML += `<option value="${m.id}">${m.nombre}</option>`;
            });
            municipioSelect.disabled = false;
        } catch (err) {
            console.error("Error al cargar municipios:", err);
        }
    });

    municipioSelect.addEventListener("change", async () => {
        const idMunicipio = municipioSelect.value;

        coloniaSelect.innerHTML = `<option selected disabled>Seleccione una colonia</option>`;
        coloniaSelect.disabled = true;

        if (!idMunicipio) return;

        try {
            const colonias = await fetch(`/clinicas/colonias/${idMunicipio}`).then(r => r.json());
            colonias.forEach(c => {
                coloniaSelect.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
            });
            coloniaSelect.disabled = false;
        } catch (err) {
            console.error("Error al cargar colonias:", err);
        }
    });

    // Manejo del formulario
    document.getElementById("registro-form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = Object.fromEntries(new FormData(this).entries());

        try {
            const res = await fetch("/clinicas/formClinica/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                window.location.href = "/clinicas";
                localStorage.setItem("registroClinicaExitoso", "true");
            } else {
                mostrarError("Error en el registro: " + (data.error || data.message));
            }
        } catch (err) {
            console.error("Error al enviar datos:", err);
            mostrarError("Ocurrió un error al registrar la clínica.");
        }
    });
});
