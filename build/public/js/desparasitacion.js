async function enviarDesparasitacion(datos) {
  const res = await fetch('/desparasitacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Error:', error);
  } else {
    const respuesta = await res.json();
    console.log(respuesta.message);
  }
}
