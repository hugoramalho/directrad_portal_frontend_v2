/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 18/03/2025
 **/


export class UserClinica {
    id: number;
    nome_razao: string;
    nome?: string | null | undefined;

    constructor(data: any) {
        this.id = data.id;
        this.nome_razao = data.username || null;
        this.nome = data.nome || null;
    }
}
