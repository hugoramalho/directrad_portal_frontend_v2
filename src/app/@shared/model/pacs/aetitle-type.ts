/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/03/2025
 **/


// 1️⃣ Enum representando os valores que chegam do backend
export enum TipoAetitle {
    STORAGE = 'storage',
    EXTERNAL = 'external',
    WORKLIST = 'worklist',
    LONGO_PRAZO = 'long_term'
}

export class TipoAetitleMapper {
    private static readonly descriptions: Record<TipoAetitle, string> = {
        [TipoAetitle.STORAGE]: "Armazenamento (Storage)",
        [TipoAetitle.EXTERNAL]: "Externo/Exportação",
        [TipoAetitle.WORKLIST]: "Worklist",
        [TipoAetitle.LONGO_PRAZO]: "Armazenamento - Longo Prazo"
    };

    static getDescription(type: TipoAetitle): string {
        return this.descriptions[type] || "Tipo Aetitle desconhecido";
    }
}
