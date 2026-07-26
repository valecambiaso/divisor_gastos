import { Persona } from "./entidades/persona";

let personas: Persona[] = [
  { nombre: "Sofía", gastos: [ { descripcion: "Pizza", monto: 80 }, { descripcion: "Taxi", monto: 30 } ], deuda: 0 },
  { nombre: "Tomás", gastos: [ { descripcion: "Bebidas", monto: 50 } ], deuda: 0 },
  { nombre: "Uriel", gastos: [ { descripcion: "Postre", monto: 20 } ], deuda: 0 },
  { nombre: "Valentina", gastos: [], deuda: 0 }
];

export function dividirGastos(personas: Persona[]): string {

  let output = '';
  
  let totalGastos = 0;

  for (let persona of personas) {
    for (let gasto of persona.gastos) {
      totalGastos += gasto.monto;
    }
  }

  let gastoPorPersona = totalGastos / personas.length;

  output += (`Gasto total: $${totalGastos.toFixed(2)}\n`);
  output += (`Cada persona debe pagar $${gastoPorPersona.toFixed(2)}\n`);

  output += (`----------------------------------\n`);

  for (let persona of personas) {
    let gastoIndividual = persona.gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    let diferencia = gastoPorPersona - gastoIndividual;
    persona.deuda = parseFloat(diferencia.toFixed(2));
  }

  if (personas.every(persona => persona.deuda === 0)) {
    
    output += ("No hay deudas que saldar!");

  } else {

    personas.sort((a, b) => (b.deuda! - a.deuda!));

    for (let i = 0; i < personas.length; i++) {
      let aPagar = personas[i].deuda;

      for (let j = personas.length - 1; j > i; j--) {
        var aCobrar = personas[j].deuda;
        if (aPagar <= 0) break;

        let monto = Math.min(aPagar, -aCobrar);
        aPagar -= monto;
        aCobrar += monto;

        if (monto != 0)
          output += (`${personas[i].nombre} le paga $${monto.toFixed(2)} a ${personas[j].nombre} \n`);

        personas[i].deuda = parseFloat(aPagar.toFixed(2));
        personas[j].deuda = parseFloat(aCobrar.toFixed(2));
      }
    }
  }

  return output;
}

//dividirGastos(personas);