// === Configuracion API ===
const API_URL = '/api/transacciones';

// === Variables Globales ===
let ingresos = [];
let egresos = [];

// === Selectores ===
// Ingresos
const inputDescIngreso = document.querySelector(".input-des-ingreso");
const inputMontoIngreso = document.querySelector(".input-importe-ingreso");
const btnAgregarIngreso = document.querySelector(".btn-ingresos");
const tbodyIngresos = document.querySelector(".resultadoIngreso");

// Egresos
const inputDescEgreso = document.querySelector(".descripcionEgresos");
const inputMontoEgreso = document.querySelector(".importesEgresos");
const btnAgregarEgreso = document.querySelector(".btn-guardarEgresos");
const tbodyEgresos = document.querySelector(".resultadoEgreso");

// Totales
const elTotalIngresos = document.querySelector("#total-ingresos");
const elTotalEgresos = document.querySelector("#total-egresos");
const elTotalDiezmo = document.querySelector("#total-diezmo");
const elSaldoActual = document.querySelector("#saldo-actual");

// === Inicialización ===
document.addEventListener("DOMContentLoaded", () => {
  cargarDatos();
  validarInputs(); // Estado inicial botones
});

// === Event Listeners ===
// Validaciones
[inputDescIngreso, inputMontoIngreso].forEach(el => el.addEventListener("input", () => validarBoton(inputDescIngreso, inputMontoIngreso, btnAgregarIngreso)));
[inputDescEgreso, inputMontoEgreso].forEach(el => el.addEventListener("input", () => validarBoton(inputDescEgreso, inputMontoEgreso, btnAgregarEgreso)));

// Agregar
btnAgregarIngreso.addEventListener("click", () => agregarTransaccion('ingreso'));
btnAgregarEgreso.addEventListener("click", () => agregarTransaccion('egreso'));

// Borrar (Delegación de eventos en tablas)
tbodyIngresos.addEventListener("click", (e) => manejarClickTabla(e));
tbodyEgresos.addEventListener("click", (e) => manejarClickTabla(e));

// === Funciones Lógica ===

async function cargarDatos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al cargar datos');
    const data = await response.json();
    
    // Separar por tipo
    ingresos = data.filter(t => t.tipo === 'ingreso');
    egresos = data.filter(t => t.tipo === 'egreso');

    renderizarIngresos();
    renderizarEgresos();
    actualizarTotales();
  } catch (error) {
    console.error(error);
    alert('Error conectando con el servidor. Asegúrate de que npm start esté corriendo.');
  }
}

function validarBoton(inputDesc, inputMonto, btn) {
  if (inputDesc.value.trim() !== "" && inputMonto.value.trim() !== "") {
    btn.disabled = false; // Habilitar
    btn.classList.remove("btn-disabled");
  } else {
    btn.disabled = true; // Deshabilitar
    btn.classList.add("btn-disabled");
  }
}

async function agregarTransaccion(tipo) {
  const esIngreso = tipo === 'ingreso';
  const descInput = esIngreso ? inputDescIngreso : inputDescEgreso;
  const montoInput = esIngreso ? inputMontoIngreso : inputMontoEgreso;
  
  const nuevaTransaccion = {
    descripcion: descInput.value,
    monto: parseFloat(montoInput.value),
    tipo: tipo
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaTransaccion)
    });

    if (!response.ok) throw new Error('Error al guardar');
    
    // Recargar todo para asegurar sincronización (o podríamos agregar manual a la lista local)
    await cargarDatos();
    
    // Limpiar y resetear validación
    descInput.value = "";
    montoInput.value = "";
    validarBoton(descInput, montoInput, esIngreso ? btnAgregarIngreso : btnAgregarEgreso);

  } catch (error) {
    console.error(error);
    alert('No se pudo guardar la transacción.');
  }
}

async function manejarClickTabla(e) {
  if (e.target.closest(".btn-borrar")) {
    const btn = e.target.closest(".btn-borrar");
    const id = btn.dataset.id; // ID viene de la BD
    
    if (confirm('¿Estás seguro de eliminar este registro?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar');
            
            await cargarDatos();
        } catch (error) {
            console.error(error);
            alert('No se pudo eliminar el registro.');
        }
    }
  }
}

// === Funciones de Renderizado ===

function renderizarIngresos() {
  tbodyIngresos.innerHTML = "";
  // Ya vienen ordenados del backend ("ORDER BY fecha DESC, id DESC")
  ingresos.forEach(item => {
    const row = document.createElement("tr");
    // Formatear fecha que viene de SQL (ej: 2024-05-10T...)
    const fecha = new Date(item.fecha).toLocaleDateString();
    
    row.innerHTML = `
      <td>${fecha}</td>
      <td>${item.descripcion}</td>
      <td>${formatoMoneda(item.monto)}</td>
      <td class="acciones">
        <button class="btn btn-mini btn-borrar" data-id="${item.id}">X</button>
      </td>
    `;
    tbodyIngresos.appendChild(row);
  });
}

function renderizarEgresos() {
  tbodyEgresos.innerHTML = "";
  egresos.forEach(item => {
    const row = document.createElement("tr");
    const fecha = new Date(item.fecha).toLocaleDateString();

    row.innerHTML = `
      <td>${fecha}</td>
      <td>${item.descripcion}</td>
      <td>${formatoMoneda(item.monto)}</td>
      <td class="acciones">
        <button class="btn btn-mini btn-borrar" data-id="${item.id}">X</button>
      </td>
    `;
    tbodyEgresos.appendChild(row);
  });
}

function actualizarTotales() {
  const totalIng = ingresos.reduce((acc, curr) => acc + Number(curr.monto), 0);
  const totalEgr = egresos.reduce((acc, curr) => acc + Number(curr.monto), 0);
  const diezmo = totalIng * 0.1;
  const saldo = totalIng - totalEgr;

  elTotalIngresos.textContent = formatoMoneda(totalIng);
  elTotalEgresos.textContent = formatoMoneda(totalEgr);
  elTotalDiezmo.textContent = formatoMoneda(diezmo);
  elSaldoActual.textContent = formatoMoneda(saldo);
}

function formatoMoneda(valor) {
  // Asegurarse que es número
  const numero = Number(valor);
  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// Función auxiliar para inicializar validaciones al cargar si hay texto
function validarInputs() {
  validarBoton(inputDescIngreso, inputMontoIngreso, btnAgregarIngreso);
  validarBoton(inputDescEgreso, inputMontoEgreso, btnAgregarEgreso);
}
