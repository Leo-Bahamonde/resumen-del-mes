// Variables
const tablaContainer = document.querySelector(".tabla-container");
const tbodyIngresos = document.querySelector(".resultado");
const ingresoSection = document.querySelector(".ingresoSection table");
let ingresoDescripcion = document.querySelector(".ingresoDescripcion");
let ingresoImportes = document.querySelector(".ingresoImportes")
let articulos = [];

// Eventos
tablaContainer.addEventListener("click", guardarIngresos);

// Funciones
function guardarIngresos(e) {
  if (e.target.classList.contains("btn-guardar")) {
    const fila = e.target.closest("tr");
    leeDatos(fila);
  }
}

function leeDatos(fila) {
  let ingresos = {
    fecha: new Date().toLocaleDateString(),
    ingresoDescripcion: ingresoDescripcion.value,
    ingresoImportes: ingresoImportes.value,
  };

  articulos = [...articulos, ingresos];
  mostrarDatos();

    ingresoDescripcion.value = "",
    ingresoImportes.value = ""

}

function mostrarDatos() {
  // Limpio el tbody antes de volver a mostrar
  tbodyIngresos.innerHTML = "";

  // Recorro el array y creo filas nuevas
  articulos.forEach((item) => {
    const row = document.createElement("tr");
    const { fecha, ingresoDescripcion, ingresoImportes } = item;
    row.innerHTML = `
    <td>${fecha}</td>
    <td>${ingresoDescripcion}</td>
    <td>${ingresoImportes}</td>
    `;
    tbodyIngresos.appendChild(row);
    
  });
}

// Agrega al resumen central ingresos


