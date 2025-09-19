//variables
const tablaContainer = document.querySelector(".tabla-container");
let articulos = [];

//eventos
tablaContainer.addEventListener("click", guardarIngresos);

// Funciones

function guardarIngresos(e) {
  if (e.target.classList.contains("btn-guardar")) {
    const datos = e.target.parentElement.parentElement;
    leeDatos(datos)
    
  }
}

function leeDatos(datos) {
  let ingresos = {
    ingresoDescripcion: datos.querySelector(".ingresoDescripcion").value,
    ingresoImportes: datos.querySelector(".ingresoImportes").value,
  };
  
  articulos = [...articulos,ingresos]
  console.log(articulos);
}





































//variables
/* const ingresoDescripcion = document.querySelector("#ingresoDescripcion");
const ingresoImportes = document.querySelector("#ingresoImportes");
const egresosDescripcion = document.querySelector("#egresoDescripcion");
const egresosImportes = document.querySelector("#egresoImporte");
//variables tablas
const tdIngDescripcion = document.querySelector(".tdIngDescripcion");



//eventos
ingresoDescripcion.addEventListener("blur", ingresos);
ingresoImportes.addEventListener("blur", ingresos);

//funciones

function ingresos(e) {
  const td = document.createElement("TD");
  td.textContent = e.target.value;
  tdIngDescripcion.appendChild(td)
  
  
}
 */
