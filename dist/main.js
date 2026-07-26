import { dividirGastos } from "./divisor.js";
let personas = [];
const inputNombre = document.getElementById("nombre");
const btnAgregar = document.getElementById("btnAgregarPersona");
const listaPersonas = document.getElementById("listaPersonas");
const btnCalcular = document.getElementById("btnCalcular");
const resultado = document.getElementById("resultado");
btnAgregar.addEventListener("click", () => {
    if (!inputNombre.value.trim())
        return;
    personas.push({ nombre: inputNombre.value.trim(), gastos: [], deuda: 0 });
    inputNombre.value = "";
    renderPersonas();
});
function renderPersonas() {
    listaPersonas.innerHTML = personas
        .map((p, index) => `
      <div class="card mb-2">
        <div class="card-body">
          <strong>${p.nombre}</strong>
          <div class="input-group mt-2">
            <input type="text" class="form-control" id="desc-${index}" placeholder="Descripción del gasto" />
            <input type="number" class="form-control" id="monto-${index}" placeholder="Monto" />
            <button class="btn btn-outline-secondary" onclick="agregarGasto(${index})">Agregar gasto</button>
          </div>
          <ul class="mt-2">${p.gastos.map(g => `<li>${g.descripcion}: $${g.monto}</li>`).join("")}</ul>
        </div>
      </div>`)
        .join("");
}
window.agregarGasto = (index) => {
    const desc = document.getElementById(`desc-${index}`);
    const monto = document.getElementById(`monto-${index}`);
    if (!desc.value || !monto.value)
        return;
    personas[index].gastos.push({ descripcion: desc.value, monto: parseFloat(monto.value) });
    renderPersonas();
};
btnCalcular.addEventListener("click", () => {
    resultado.innerHTML = "";
    let mensaje = dividirGastos(personas);
    alert(mensaje);
});
