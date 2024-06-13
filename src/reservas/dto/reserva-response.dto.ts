export class ReservaResponseDto {
    id: number;
    fecha: string;
    hora: string;
    cantidad: number;
    numeroMesa: number;
    usuario: {
        nombre: string;
        apellido: string;
        email: string;
    };
    metodoPago: {
        nombre: string;
    };
}