import { Persona } from "./entidades/persona";
import { dividirGastos } from "./divisor.js";

let personas: Persona[] = [];

const inputNombre = document.getElementById("nombre") as HTMLInputElement;
const btnAgregar = document.getElementById("btnAgregarPersona")!;
const listaPersonas = document.getElementById("listaPersonas")!;
const btnCalcular = document.getElementById("btnCalcular")!;
const resultado = document.getElementById("resultado")!;
const btnReiniciar = document.getElementById("btnReiniciar") as HTMLButtonElement;
const modalConfirmar = new (window as any).bootstrap.Modal(document.getElementById("modalConfirmar"));
const modalTitulo = document.getElementById("modalConfirmarTitulo")!;
const modalTexto = document.getElementById("modalConfirmarTexto")!;
const btnConfirmar = document.getElementById("btnConfirmar")!;

let accionPendiente: (() => void) | null = null;

function pedirConfirmacion(titulo: string, texto: string, textoBoton: string, accion: () => void) {
  modalTitulo.textContent = titulo;
  modalTexto.textContent = texto;
  btnConfirmar.textContent = textoBoton;
  accionPendiente = accion;
  modalConfirmar.show();
}

btnConfirmar.addEventListener("click", () => {
  accionPendiente?.();
  accionPendiente = null;
  modalConfirmar.hide();
});

btnAgregar.addEventListener("click", () => {
  if (!inputNombre.value.trim()) return;

  personas.push({ nombre: inputNombre.value.trim(), gastos: [], deuda: 0 });
  inputNombre.value = "";
  renderPersonas();
});

inputNombre.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnAgregar.click();
});

function formatMonto(monto: number): string {
  return "$" + monto.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderPersonas() {
  btnReiniciar.disabled = personas.length === 0;

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
            <span class="badge rounded-pill text-bg-light border fs-6 monto">${formatMonto(total)}</span>
            <button class="btn btn-sm btn-eliminar" onclick="eliminarPersona(${index})" title="Borrar persona" aria-label="Borrar persona"><i class="bi bi-trash3"></i></button>
          </div>
          ${p.gastos.length ? `
          <div class="mb-3">
            ${p.gastos.map(g => `
              <div class="gasto-item">
                <span>${g.descripcion || `<span class="text-body-secondary fst-italic">Sin descripción</span>`}</span>
                <span class="monto">${formatMonto(g.monto)}</span>
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

function renderResultado(mensaje: string) {
  const lineas = mensaje.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("---"));
  const total = lineas.find(l => l.startsWith("Gasto total"))?.split("$")[1] ?? "0.00";
  const porPersona = lineas.find(l => l.startsWith("Cada persona"))?.split("$")[1] ?? "0.00";
  const pagos = lineas
    .map(l => l.match(/^(.+) le paga \$([\d.]+) a (.+)$/))
    .filter((m): m is RegExpMatchArray => m !== null);

  resultado.innerHTML = `
    <div class="card shadow-sm border-0">
      <div class="card-body p-4">
        <h2 class="h5 fw-bold mb-3"><i class="bi bi-receipt me-2"></i>Resultado</h2>
        <div class="row g-3 mb-4">
          <div class="col-6"><div class="stat"><div class="small text-body-secondary">Gasto total</div><div class="valor">${formatMonto(parseFloat(total))}</div></div></div>
          <div class="col-6"><div class="stat"><div class="small text-body-secondary">Por persona</div><div class="valor">${formatMonto(parseFloat(porPersona))}</div></div></div>
        </div>
        ${pagos.length
          ? pagos.map(([, deudor, monto, acreedor]) => `
            <div class="pago">
              <span class="avatar">${deudor.charAt(0).toUpperCase()}</span>
              <span class="nombres">
                <span class="fw-semibold">${deudor}</span>
                <i class="bi bi-arrow-right flecha mx-1"></i>
                <span class="fw-semibold">${acreedor}</span>
              </span>
              <span class="monto fs-5">${formatMonto(parseFloat(monto))}</span>
            </div>`).join("")
          : `<div class="alert alert-success mb-0"><i class="bi bi-check-circle me-2"></i>¡No hay deudas que saldar!</div>`}
      </div>
    </div>`;
  resultado.scrollIntoView({ behavior: "smooth" });
}

renderPersonas();

(window as any).agregarGasto = (index: number) => {
  const desc = document.getElementById(`desc-${index}`) as HTMLInputElement;
  const monto = document.getElementById(`monto-${index}`) as HTMLInputElement;

  if (!monto.value) return;

  personas[index].gastos.push({ descripcion: desc.value.trim(), monto: parseFloat(monto.value) });
  renderPersonas();
};

(window as any).eliminarPersona = (index: number) => {
  const persona = personas[index];
  const cantidad = persona.gastos.length;
  pedirConfirmacion(
    `¿Borrar a ${persona.nombre}?`,
    cantidad ? "También se borran sus gastos." : "No tiene gastos cargados.",
    "Borrar",
    () => {
      personas.splice(index, 1);
      resultado.innerHTML = "";
      renderPersonas();
    }
  );
};

btnReiniciar.addEventListener("click", () => {
  pedirConfirmacion(
    "¿Empezar de nuevo?",
    "Se borran todas las personas y sus gastos.",
    "Reiniciar",
    () => {
      personas = [];
      resultado.innerHTML = "";
      renderPersonas();
    }
  );
});

btnCalcular.addEventListener("click", () => {
  resultado.innerHTML = "";
  if (personas.length === 0) return;
  let mensaje = dividirGastos(personas);
  renderResultado(mensaje);
});
