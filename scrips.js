// Variables

//boton bloqueado egresos
const inputDescripcion = document.querySelector(".inputDescripcion");
const inputImportes = document.querySelector(".inputImportes");
const btnGuardar = document.querySelector(".btnGuardar");

//boton bloqueado ingresos
const inputDesIngreso = document.querySelector(".input-des-ingreso");
const inputImporteIngreso = document.querySelector(".input-importe-ingreso");
const btnIngreso = document.querySelector(".btn-ingresos");

const tbodyIngresos = document.querySelector(".resultadoIngreso");
const tbodyEgresos = document.querySelector(".resultadoEgreso");

const ingresoSection = document.querySelector(".ingresoSection table");
const egresoSection = document.querySelector(".egresoSection");

let descripcionIngresos = document.querySelector(".descripcionIngresos");
let importesIngresos = document.querySelector(".importesIngresos");

let descripcionEgresos = document.querySelector(".descripcionEgresos");
let importesEgresos = document.querySelector(".importesEgresos");

const btnGuardarEgresos = document.querySelector(".btn-guardarEgresos");
const btnGuardarIngresos = document.querySelector(".btn btn-guardarIngresos");

let ingresos = [];
let egresos = [];

// Eventos
ingresoSection.addEventListener("click", guardar);
egresoSection.addEventListener("click", guardarEgresos);

inputDescripcion.addEventListener("input", validar);
inputImportes.addEventListener("input", validar);

//eventos de validaciones

function validar() {
  if (
    inputDescripcion.value.trim() !== "" &&
    inputImportes.value.trim() !== ""
  ) {
    btnGuardar.disabled = false;
    btnGuardar.classList.add("btn-enabled");
    btnGuardar.classList.remove("btn-disabled");
  } else {
    btnGuardar.disabled = true;
    btnGuardar.classList.remove("btn-enabled");
    btnGuardar.classList.add("btn-disabled");
  }
}

// bloquear boton ingreso

inputDesIngreso.addEventListener("input", validarIngreso);
inputImporteIngreso.addEventListener("input", validarIngreso);

function validarIngreso() {
  if (
    inputDesIngreso.value.trim() !== "" &&
    inputImporteIngreso.value.trim() !== ""
  ) {
    btnIngreso.disabled = false;
    btnIngreso.classList.remove("btn-disabled");
    btnIngreso.classList.add("btn-enabled");
  } else {
    btnIngreso.disabled = true;
    btnIngreso.classList.remove("btn-enabled");
    btnIngreso.classList.add("btn-disabled");
  }
}

// Funciones
function guardar(e) {
  if (e.target.classList.contains("btn-guardarIngresos")) {
    const fila = e.target.closest("tr");
    leeDatos(fila);
  }
}

function guardarEgresos(e) {
  if (e.target.classList.contains("btn-guardarEgresos")) {
    const fila = e.target.closest("tr");
    leeDatosEgresos(fila);
  }
}

function leeDatosEgresos(fila) {
  const campos = {
    fecha: new Date().toLocaleDateString(),
    descripcionEgresos: fila.querySelector(".descripcionEgresos").value,
    importesEgresos: fila.querySelector(".importesEgresos").value,
  };

  egresos = [...egresos, campos];
  mostrarDatosEgresos();

  // limpiar inputs de esa fila

  (descripcionEgresos.value = ""), (importesEgresos.value = "");

  //bloquea el boton de guardado
  validar();
}

function leeDatos() {
  let campos = {
    fecha: new Date().toLocaleDateString(),
    descripcionIngresos: descripcionIngresos.value,
    importesIngresos: importesIngresos.value,
  };

  ingresos = [...ingresos, campos];
  mostrarDatos();

  (descripcionIngresos.value = ""), (importesIngresos.value = "");
  //bloquea el btn guardado
  validarIngreso();
}

function mostrarDatos() {
  // Limpio el tbody antes de volver a mostrar
  tbodyIngresos.innerHTML = "";

  // Recorro el array y creo filas nuevas en ingresos
  ingresos.forEach((item) => {
    const row = document.createElement("tr");
    const { fecha, descripcionIngresos, importesIngresos } = item;
    row.innerHTML = `
    <td><b>${fecha}</b></td>
    <td><b>${descripcionIngresos}</b></td>
    <td><b>${importesIngresos}</b></td>
     <td>
      <button class="btn btn-borrar">Borrar</button>
      <button class="btn btn-editar">Editar</button>
    </td>
    `;
    tbodyIngresos.appendChild(row);
  });
}

function mostrarDatosEgresos() {
  tbodyEgresos.innerHTML = "";
  egresos.forEach((item) => {
    const row = document.createElement("tr");
    const { fecha, descripcionEgresos, importesEgresos } = item;
    row.innerHTML = `
    <td><b>${fecha}</b></td>
    <td><b>${descripcionEgresos}</b></td>
    <td><b>${importesEgresos}</b></td>
    <td>
      <button class="btn btn-borrar">Borrar</button>
      <button class="btn btn-editar">Editar</button>
    </td>
    `;

    tbodyEgresos.appendChild(row);
  });
}
//borrar ingreso de la tabla

tbodyIngresos.addEventListener('click', borrarIngreso)

function borrarIngreso(e){
  if(e.target.classList.contains('btn-borrar')){
   const fila = e.target.closest('tr'); // saco la fila entera
    const index = Array.from(tbodyIngresos.children).indexOf(fila); // posición de la fila en el array
    
    ingresos.splice(index, 1); // elimino del array
    mostrarDatos(); // repinto la tabla sin ese registro
  }
}