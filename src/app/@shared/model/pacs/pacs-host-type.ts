/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 18/03/2025
 **/

// 1️⃣ Enum representando os valores que chegam do backend
export enum PacsHostType {
    PACS_CLIENTE = "PACS_CLIENTE",
    PACS_CENTRAL_ORACLE = "PACS_CENTRAL_ORACLE",
    PACS_CENTRAL_EVEO = "PACS_CENTRAL_EVEO",
    PACS_CENTRAL_WORKLIST_EVEO = "PACS_CENTRAL_WORKLIST_EVEO",
    PACS_CENTRAL_WORKLIST_ORACLE = "PACS_CENTRAL_WORKLIST_ORACLE",
    PACS_CENTRAL_LONGO_PRAZO_OVH = "PACS_CENTRAL_LONGO_PRAZO_OVH",
    PACS_SANDBOX_ORACLE = "PACS_SANDBOX_ORACLE",
    PACS_SANDBOX_AMAZON = "PACS_SANDBOX_AMAZON",
}

export class PacsHostMapper {
    private static readonly descriptions: Record<PacsHostType, string> = {
        [PacsHostType.PACS_CLIENTE]: "Host do cliente",
        [PacsHostType.PACS_CENTRAL_ORACLE]: "Pacs Central - Oracle",
        [PacsHostType.PACS_CENTRAL_EVEO]: "Pacs Central - Eveo",
        [PacsHostType.PACS_CENTRAL_WORKLIST_EVEO]: "Pacs Central de Worklist - Eveo ",
        [PacsHostType.PACS_CENTRAL_WORKLIST_ORACLE]: "Pacs Central de Worklist - Oracle",
        [PacsHostType.PACS_CENTRAL_LONGO_PRAZO_OVH]: "Pacs Central de Longo Prazo - OVH",
        [PacsHostType.PACS_SANDBOX_ORACLE]: "Pacs de testes - Oracle",
        [PacsHostType.PACS_SANDBOX_AMAZON]: "Pacs de testes - Amazon",
    };

    static getDescription(type: PacsHostType): string {
        return this.descriptions[type] || "Tipo desconhecido";
    }
}
