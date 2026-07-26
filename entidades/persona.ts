import { Gasto } from "./gasto";

export class Persona {
    public nombre: string;
    public gastos: Gasto[];
    public deuda: number = 0;

    constructor(nombre: string, gastos: Gasto[] = []) {
        this.nombre = nombre;
        this.gastos = gastos;
    }
}