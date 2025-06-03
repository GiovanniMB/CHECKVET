const contenedorCitas = document.getElementById("citas-container");

function crearTarjetasCitasInicio(citas) {
    citas.forEach(cita => {
        
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3', 'w-50');
        
        const row = document.createElement('div');
        row.classList.add('row', 'g-0');

        
        const colImg = document.createElement('div');
        colImg.classList.add('col-md-4');

        const imagen = document.createElement('img');
        imagen.src =  '/pitbull.jpg'; 
        imagen.classList.add('img-fluid', 'rounded-start');
        imagen.alt = 'mascota';

        colImg.appendChild(imagen);

        
        const colDatos = document.createElement('div');
        colDatos.classList.add('col-md-8');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body','text-center');

        
        const fechaOriginal = new Date(cita.fecha);
        const dia = fechaOriginal.getDate().toString().padStart(2, '0');
        const mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0'); 
        const anio = fechaOriginal.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${anio}`;
        
        const horas = fechaOriginal.getHours().toString().padStart(2, '0');
        const minutos = fechaOriginal.getMinutes().toString().padStart(2, '0');
        const horaFormateada = `${horas}:${minutos}`;

        
        const nombre = document.createElement('h5');
        nombre.classList.add('card-title');
        nombre.textContent = cita.nombre;

        const fechaElemento = document.createElement('p');
        fechaElemento.classList.add('card-text');
        fechaElemento.innerHTML = `<strong>Fecha: </strong>${fechaFormateada}`;

        const horaElemento = document.createElement('p');
        horaElemento.classList.add('card-text');
        horaElemento.innerHTML = `<strong>Hora: </strong>${horaFormateada}`;

        const motivo = document.createElement('p');
        motivo.classList.add('card-text');
        motivo.innerHTML = `<strong>Motivo: </strong>${cita.motivo}`;

        // Agregar elementos al card body
        cardBody.appendChild(nombre);
        cardBody.appendChild(fechaElemento);
        cardBody.appendChild(horaElemento);
        cardBody.appendChild(motivo);

        colDatos.appendChild(cardBody);
        row.appendChild(colImg);
        row.appendChild(colDatos);
        card.appendChild(row);
        contenedorCitas.appendChild(card);
    });
}


const style = document.createElement('style');
style.textContent = `
    .card {
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease;
    }
    .card:hover {
        transform: translateY(-5px);
    }
    .card-title {
        color: #28a745;
        margin-bottom: 1rem;
    }
    .card-text {
        margin-bottom: 0.5rem;
    }
`;
document.head.appendChild(style);

getCitas().then(citas => {
    crearTarjetasCitasInicio(citas);
}).catch(error => {
    console.error("Hubo un error al obtener las citas:", error);
});
