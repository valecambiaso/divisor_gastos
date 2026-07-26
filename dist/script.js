let personas = [
    { nombre: "Pedro", gastos: [], deuda: 0 },
    { nombre: "Laura", gastos: [], deuda: 0 },
    { nombre: "Marta", gastos: [], deuda: 0 }
];
function dividirGastos(personas) {
    let totalGastos = 0;
    for (let persona of personas) {
        for (let gasto of persona.gastos) {
            totalGastos += gasto.monto;
        }
    }
    let gastoPorPersona = totalGastos / personas.length;
    for (let persona of personas) {
        let gastoIndividual = persona.gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        let diferencia = gastoPorPersona - gastoIndividual;
        persona.deuda = parseFloat(diferencia.toFixed(2));
    }
    if (personas.every(persona => persona.deuda === 0)) {
        console.log("No hay deudas que saldar!");
    }
    else {
        personas.sort((a, b) => (b.deuda - a.deuda));
        for (let i = 0; i < personas.length; i++) {
            let aPagar = personas[i].deuda;
            for (let j = personas.length - 1; j > i; j--) {
                var aCobrar = personas[j].deuda;
                if (aPagar <= 0)
                    break;
                let monto = Math.min(aPagar, -aCobrar);
                aPagar -= monto;
                aCobrar += monto;
                console.log(`${personas[i].nombre} le paga $${monto.toFixed(2)} a ${personas[j].nombre}`);
                personas[i].deuda = parseFloat(aPagar.toFixed(2));
                personas[j].deuda = parseFloat(aCobrar.toFixed(2));
            }
        }
    }
}
dividirGastos(personas);
export {};
