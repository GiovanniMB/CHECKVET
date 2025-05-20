const contenedorCitas = document.getElementById("citas-container");

function crearTarjetasCitasInicio(citas) 
{
    citas.forEach(cita => 
        { 
            const citaNueva = document.createElement('div');
            citaNueva.classList.add("cita");
            
            const imagen = document.createElement('img');
            imagen.src = cita.img;
            imagen.alt = 'mascota';
            
            const datosDiv = document.createElement('div');
            datosDiv.classList.add("datos");
            
            const nombre = document.createElement('h2');
            nombre.textContent = cita.nombre
            
            const fecha = document.createElement('h4');
            fecha.innerHTML = `<strong>Fecha: </strong><span>${cita.fecha}</span>`;
            
            const hora = document.createElement('h4');
            hora.innerHTML = `<strong>Hora: </strong><span>${cita.hora}</span>`;
            
            const motivo = document.createElement('h4');
            motivo.innerHTML = `<strong>Motivo: </strong><span>${cita.motivo}</span>`;
            
            datosDiv.appendChild(nombre);
            datosDiv.appendChild(fecha);
            datosDiv.appendChild(hora);
            datosDiv.appendChild(motivo);
            
            citaNueva.appendChild(imagen);
            citaNueva.appendChild(datosDiv);
            
            contenedorCitas.appendChild(citaNueva);
        });
}