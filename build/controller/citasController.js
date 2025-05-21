const contenedorCitas = document.getElementById("citas-container");

function crearTarjetasCitasInicio(citas) 
{
    citas.forEach(cita => 
        {
            const citaNueva = document.createElement('div');
            citaNueva.classList.add("cita");

            const imagen = document.createElement('img');
        
            imagen.src = cita.foto;
            imagen.alt = 'mascota';

            const datosDiv = document.createElement('div');
            datosDiv.classList.add("datos");

            const nombre = document.createElement('h2');
            nombre.textContent = cita.nombre;

            const fechaOriginal = new Date(cita.fecha);
            
            const dia = fechaOriginal.getDate().toString().padStart(2, '0');
            const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0'); 
            const anio = fechaOriginal.getFullYear();
            const fechaFormateada = `${dia}-${mes}-${anio}`; 

            const horas = fechaOriginal.getHours().toString().padStart(2, '0');
            const minutos = fechaOriginal.getMinutes().toString().padStart(2, '0');
            const horaFormateada = `${horas}:${minutos}`; 
            
            const fechaElemento = document.createElement('h4');
            fechaElemento.innerHTML = `<strong>Fecha: </strong><span>${fechaFormateada}</span>`;

            const horaElemento = document.createElement('h4');
            horaElemento.innerHTML = `<strong>Hora: </strong><span>${horaFormateada}</span>`;

            const motivo = document.createElement('h4');
            motivo.innerHTML = `<strong>Motivo: </strong><span>${cita.motivo}</span>`;

            datosDiv.appendChild(nombre);
            datosDiv.appendChild(fechaElemento); 
            datosDiv.appendChild(horaElemento); 
            datosDiv.appendChild(motivo);

            citaNueva.appendChild(imagen);
            citaNueva.appendChild(datosDiv);

            contenedorCitas.appendChild(citaNueva);
        });
}

getCitas().then(citas => {
    crearTarjetasCitasInicio(citas);
}).catch(error => {
    console.error("Hubo un error al obtener las citas:", error);
});