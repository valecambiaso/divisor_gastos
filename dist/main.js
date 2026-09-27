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
inputNombre.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        btnAgregar.click();
});
function renderPersonas() {
    if (personas.length === 0) {
        listaPersonas.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-people"></i>
        Todavía no hay nadie. Agregá a las personas que participaron.
      </div>`;
        return;
    }
    listaPersonas.innerHTML = personas
        .map((p, index) => {
        const total = p.gastos.reduce((sum, g) => sum + g.monto, 0);
        return `
      <div class="card persona-card shadow-sm border-0 mb-3">
        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-3 mb-3">
            <span class="avatar">${p.nombre.charAt(0).toUpperCase()}</span>
            <div class="flex-grow-1">
              <div class="fw-semibold fs-5">${p.nombre}</div>
              <div class="small text-body-secondary">${p.gastos.length} ${p.gastos.length === 1 ? "gasto" : "gastos"}</div>
            </div>
            <span class="badge rounded-pill text-bg-light border fs-6 monto">$${total.toFixed(2)}</span>
          </div>
          ${p.gastos.length ? `
          <div class="mb-3">
            ${p.gastos.map(g => `
              <div class="gasto-item">
                <span>${g.descripcion}</span>
                <span class="monto">$${g.monto.toFixed(2)}</span>
              </div>`).join("")}
          </div>` : ""}
          <div class="input-group">
            <input type="text" class="form-control" id="desc-${index}" placeholder="Descripción" />
            <span class="input-group-text">$</span>
            <input type="number" class="form-control" id="monto-${index}" placeholder="Monto" style="max-width: 8rem" />
            <button class="btn btn-outline-primary" onclick="agregarGasto(${index})"><i class="bi bi-plus-lg"></i></button>
          </div>
        </div>
      </div>`;
    })
        .join("");
}
function renderResultado(mensaje) {
    var _a, _b, _c, _d;
    const lineas = mensaje.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("---"));
    const total = (_b = (_a = lineas.find(l => l.startsWith("Gasto total"))) === null || _a === void 0 ? void 0 : _a.split("$")[1]) !== null && _b !== void 0 ? _b : "0.00";
    const porPersona = (_d = (_c = lineas.find(l => l.startsWith("Cada persona"))) === null || _c === void 0 ? void 0 : _c.split("$")[1]) !== null && _d !== void 0 ? _d : "0.00";
    const pagos = lineas
        .map(l => l.match(/^(.+) le paga \$([\d.]+) a (.+)$/))
        .filter((m) => m !== null);
    resultado.innerHTML = `
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <h2 class="h5 fw-bold mb-3"><i class="bi bi-receipt me-2"></i>Resultado</h2>
        <div class="row g-3 mb-4">
          <div class="col-6"><div class="stat"><div class="small text-body-secondary">Gasto total</div><div class="valor">$${total}</div></div></div>
          <div class="col-6"><div class="stat"><div class="small text-body-secondary">Por persona</div><div class="valor">$${porPersona}</div></div></div>
        </div>
        ${pagos.length
        ? pagos.map(([, deudor, monto, acreedor]) => `
            <div class="pago">
              <span class="avatar">${deudor.charAt(0).toUpperCase()}</span>
              <span class="fw-semibold">${deudor}</span>
              <i class="bi bi-arrow-right flecha"></i>
              <span class="fw-semibold">${acreedor}</span>
              <span class="monto fs-5">$${monto}</span>
            </div>`).join("")
        : `<div class="alert alert-success mb-0"><i class="bi bi-check-circle me-2"></i>¡No hay deudas que saldar!</div>`}
      </div>
    </div>`;
    resultado.scrollIntoView({ behavior: "smooth" });
}
renderPersonas();
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
    if (personas.length === 0)
        return;
    let mensaje = dividirGastos(personas);
    renderResultado(mensaje);
});
