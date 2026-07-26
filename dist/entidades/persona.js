export class Persona {
    constructor(nombre, gastos = []) {
        this.deuda = 0;
        this.nombre = nombre;
        this.gastos = gastos;
    }
}
