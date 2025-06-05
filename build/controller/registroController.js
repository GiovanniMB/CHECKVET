document.addEventListener("DOMContentLoaded", async () => {
    bloquearSelects(["Municipio", "Colonia", "raza"]);

    await cargarEspecies();
    await cargarEstados();

    document.getElementById("Especie").addEventListener("change", async function () {
        const idEspecie = this.value;
        bloquearSelects(["raza"]);
        if (idEspecie) {
            await cargarRazas(idEspecie);
        } else {
            resetSelect(document.getElementById("raza"));
        }
    });

    document.getElementById("estado").addEventListener("change", async function () {
        const estadoId = this.value;
        bloquearSelects(["Municipio", "Colonia"]);
        if (estadoId) {
            await cargarMunicipios(estadoId);
        } else {
            resetSelect(document.getElementById("Municipio"));
            resetSelect(document.getElementById("Colonia"));
        }
    });

    document.getElementById("Municipio").addEventListener("change", async function () {
        const municipioId = this.value;
        bloquearSelects(["Colonia"]);
        if (municipioId) {
            await cargarColonias(municipioId);
        } else {
            resetSelect(document.getElementById("Colonia"));
        }
    });
    document.getElementById("Curp").addEventListener("input", async function () {
        const curp = this.value.trim();
        if (curp.length === 18) {
            await verificarCliente(curp);
        }
    });

});

async function cargarDatos(selectElement, fetchFunction, loadingMessage, errorMessage, defaultMessage) {
    resetSelect(selectElement, loadingMessage);

    try {
        const datos = await fetchFunction();
        resetSelect(selectElement);

        if (datos.length === 0) {
            selectElement.appendChild(new Option(defaultMessage, ""));
            return;
        }

        datos.forEach(item => selectElement.appendChild(new Option(item.nombre, item.id)));
        selectElement.disabled = false;
    } catch (error) {
        console.error("Error:", error);
        resetSelect(selectElement, errorMessage);
    }
}

function resetSelect(selectElement, message = "Seleccione una opción") {
    selectElement.innerHTML = `<option value="">${message}</option>`;
    selectElement.disabled = true;
}

function bloquearSelects(selectIds) {
    selectIds.forEach(id => {
        const select = document.getElementById(id);
        if (select) {
            select.disabled = true;
        }
    });
}

async function cargarEspecies() {
    await cargarDatos(
        document.getElementById("Especie"),
        getEspecies,
        "Cargando especies...",
        "Error al cargar especies",
        "No hay especies disponibles"
    );
}

async function cargarRazas(idEspecie) {
    await cargarDatos(
        document.getElementById("raza"),
        () => getRazas(idEspecie),
        "Cargando razas...",
        "Error al cargar razas",
        "No hay razas para esta especie"
    );
}

async function cargarEstados() {
    await cargarDatos(
        document.getElementById("estado"),
        getEstados,
        "Cargando estados...",
        "Error al cargar estados",
        "No hay estados disponibles"
    );
}

async function cargarMunicipios(estadoId) {
    await cargarDatos(
        document.getElementById("Municipio"),
        () => getMunicipios(estadoId),
        "Cargando municipios...",
        "Error al cargar municipios",
        "No hay municipios disponibles"
    );
}

async function cargarColonias(municipioId) {
    await cargarDatos(
        document.getElementById("Colonia"),
        () => getColonias(municipioId),
        "Cargando colonias...",
        "Error al cargar colonias",
        "No hay colonias disponibles"
    );
}
async function verificarCliente(curp) {
    const data = await verificarExistenciaCliente(curp);

    const seccionDueño = document.querySelector(".form-section[aria-labelledby='datos-dueno-heading']");
    const seccionDireccion = document.querySelector(".form-section[aria-labelledby='datos-direccion-heading']");
    const seccionUsuario = document.querySelector(".form-section[aria-labelledby='datos-usuario-heading']");
    const inputCurp = document.getElementById("curpRegistrado");

    const mostrarSecciones = !data.existe;

    seccionDueño.style.display = mostrarSecciones ? "block" : "none";
    seccionDireccion.style.display = mostrarSecciones ? "block" : "none";
    seccionUsuario.style.display = mostrarSecciones ? "block" : "none";

    inputCurp.value = data.existe ? curp : "";
}

document.getElementById("registro-form").addEventListener("submit", async function (event) {

    const formData = new FormData(this);
    const file = document.getElementById("archivoImagen").files[0];


    if (file) {

        const imgFormData = new FormData();
        imgFormData.append("archivoImagen", file);

        try {


            const imgRes = await fetch("http://localhost:4000/subirImagen", {
                method: "POST",
                body: imgFormData,
            });

            const imgData = await imgRes.json();

            if (!imgData.filename) {
                console.error("Error: No se recibió un nombre válido para la imagen.");
                return;
            }


            formData.append("nombreImagen", imgData.filename);
            formData.delete("archivoImagen");

        } catch (error) {
            console.error("Error al subir imagen:", error);
            return;
        }
    }

    const datos = Object.fromEntries(formData.entries());
    console.log(datos)
    try {
        const res = await fetch("http://localhost:3000/formMAscota/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const data = await res.json();
        if (res.ok) {
            
            window.location.href = "/mascotas";

            
            localStorage.setItem("registroExitoso", "true"); 
        } else {
            const mensajeError = document.createElement("div");
            mensajeError.className = "alert alert-danger mt-3"; 
            mensajeError.innerText = "Error en el registro: " + data.error;

            document.body.prepend(mensajeError); 
        }
    } catch (error) {
        console.error("Error en el envío:", error);
    }
});