export class Gasto {
    public descripcion: string;
    public monto: number;

    constructor(descripcion: string, monto: number) {
        this.descripcion = descripcion;
        this.monto = monto;
    }
}