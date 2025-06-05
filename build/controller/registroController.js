document.addEventListener("DOMContentLoaded", async () => {
    bloquearSelects(["Municipio", "Colonia"]);

    await cargarEstados();

    document.getElementById("estado").addEventListener("change", async function () {
        const estadoId = this.value;
        bloquearSelects(["Municipio", "Colonia"]);
        if (estadoId) {
            await cargarMunicipios(estadoId);
        } else {
            resetSelect("Municipio");
            resetSelect("Colonia");
        }
    });

    document.getElementById("Municipio").addEventListener("change", async function () {
        const municipioId = this.value;
        bloquearSelects(["Colonia"]);
        if (municipioId) {
            await cargarColonias(municipioId);
        } else {
            resetSelect("Colonia");
        }
    });
});

async function cargarDatos(selectId, fetchFunction, loadingMessage, errorMessage, defaultMessage) {
    const selectElement = document.getElementById(selectId);
    resetSelect(selectId, loadingMessage);

    try {
        const datos = await fetchFunction();
        resetSelect(selectId);

        if (!datos.length) {
            selectElement.appendChild(new Option(defaultMessage, ""));
            return;
        }

        datos.forEach(item => {
            selectElement.appendChild(new Option(item.nombre, item.id));
        });

        selectElement.disabled = false;
    } catch (error) {
        console.error("Error:", error);
        resetSelect(selectId, errorMessage);
    }
}

function resetSelect(id, message = "Seleccione una opción") {
    const select = document.getElementById(id);
    if (!select) {
        console.warn(`No se encontró el select con id "${id}"`);
        return;
    }
    select.innerHTML = `<option value="">${message}</option>`;
    select.disabled = true;
}

function bloquearSelects(ids) {
    ids.forEach(id => {
        const select = document.getElementById(id);
        if (select) select.disabled = true;
    });
}

async function cargarEstados() {
    await cargarDatos("estado", getEstados, "Cargando estados...", "Error al cargar estados", "No hay estados disponibles");
}

async function cargarMunicipios(idEstado) {
    await cargarDatos("Municipio", () => getMunicipios(idEstado), "Cargando municipios...", "Error al cargar municipios", "No hay municipios disponibles");
}

async function cargarColonias(idMunicipio) {
    await cargarDatos("Colonia", () => getColonias(idMunicipio), "Cargando colonias...", "Error al cargar colonias", "No hay colonias disponibles");
}
