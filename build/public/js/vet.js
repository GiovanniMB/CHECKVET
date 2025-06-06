// Servicio para obtener estados
async function getEstados() {
  const res = await fetch('/direccion/estados');
  if (!res.ok) throw new Error('Error HTTP: ' + res.status);
  return res.json();
}

// Servicio para municipios
async function getMunicipios(idEstado) {
  const res = await fetch(`/direccion/municipios/${idEstado}`);
  if (!res.ok) throw new Error('Error HTTP: ' + res.status);
  return res.json();
}

// Servicio para colonias
async function getColonias(idMunicipio) {
  const res = await fetch(`/direccion/colonias/${idMunicipio}`);
  if (!res.ok) throw new Error('Error HTTP: ' + res.status);
  return res.json();
}

// Función para cargar estados en el select
async function cargarEstados() {
  try {
    const estados = await getEstados();
    const selectEstado = document.getElementById('estado');
    selectEstado.innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
    estados.forEach(e => {
      const option = document.createElement('option');
      option.value = e.id;
      option.textContent = e.nombre_estado;
      selectEstado.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

// Función para cargar municipios cuando cambia el estado
async function cargarMunicipios() {
  const idEstado = document.getElementById('estado').value;
  if (!idEstado) return;

  try {
    const municipios = await getMunicipios(idEstado);
    const selectMunicipio = document.getElementById('Municipio');
    selectMunicipio.innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
    municipios.forEach(m => {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = m.nombre_municipio;
      selectMunicipio.appendChild(option);
    });
    // Limpiar colonias cuando cambian municipios
    document.getElementById('Colonia').innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
  } catch (error) {
    console.error(error);
  }
}

// Función para cargar colonias cuando cambia el municipio
async function cargarColonias() {
  const idMunicipio = document.getElementById('Municipio').value;
  if (!idMunicipio) return;

  try {
    const colonias = await getColonias(idMunicipio);
    const selectColonia = document.getElementById('Colonia');
    selectColonia.innerHTML = `<option value="" selected disabled>Seleccione una opción</option>`;
    colonias.forEach(c => {
      const option = document.createElement('option');
      option.value = c.id;
      option.textContent = c.nombre_colonia;
      selectColonia.appendChild(option);
    });
  } catch (error) {
    console.error(error);
  }
}

// Event listeners para cargar municipios y colonias al cambiar selects
document.addEventListener('DOMContentLoaded', () => {
  cargarEstados();

  document.getElementById('estado').addEventListener('change', cargarMunicipios);
  document.getElementById('Municipio').addEventListener('change', cargarColonias);
});
