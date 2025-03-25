/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/03/2025
 **/


// 1️⃣ Enum representando os valores que chegam do backend
export enum PacsSyncStatus {
    SINCRONIZADO = 'SINCRONIZADO',
    SINCRONIZADO_NAO_CONCILIADO = 'SINCRONIZADO_NAO_CONCILIADO',
    NAO_SINCRONIZADO = 'NAO_SINCRONIZADO',
    NAO_ENCONTRADO = 'NAO_ENCONTRADO',
    PROCESSANDO = 'PROCESSANDO',
    FALHA_PROCESSAMENTO = 'FALHA_PROCESSAMENTO',
    FALHA_SINCRONIZACAO = 'FALHA_SINCRONIZACAO',
    FALHA_SOLICITACAO = 'FALHA_SOLICITACAO',
    FALHA_SERVIDOR = 'FALHA_SERVIDOR',
    FALHA_CRIACAO = 'FALHA_CRIACAO',
    FALHA_ALTERACAO = 'FALHA_ALTERACAO',
    FALHA_EXCLUSAO= 'FALHA_EXCLUSAO',
    FALHA_CONEXAO = 'FALHA_CONEXAO',
    NAO_CRIADO = 'NAO_CRIADO',
}

export class PacsSyncStatusMapper {
    private static readonly descriptions: Record<PacsSyncStatus, string> = {
        [PacsSyncStatus.SINCRONIZADO]: "Sincronizado",
        [PacsSyncStatus.SINCRONIZADO_NAO_CONCILIADO]: "Sincronizado - Não conciliado",
        [PacsSyncStatus.NAO_SINCRONIZADO]: "Não sincronizado",
        [PacsSyncStatus.NAO_ENCONTRADO]: "Não encontrado no Pacs ",
        [PacsSyncStatus.PROCESSANDO]: "Processando",
        [PacsSyncStatus.FALHA_PROCESSAMENTO]: "Falha no processamento",
        [PacsSyncStatus.FALHA_SINCRONIZACAO]: "Falha na sincronização",
        [PacsSyncStatus.FALHA_SOLICITACAO]: "Falha na solicitação no Pacs ",
        [PacsSyncStatus.FALHA_SERVIDOR]: "Falha na no servidor Pacs",
        [PacsSyncStatus.FALHA_CRIACAO]: "Falha na criação Pacs",
        [PacsSyncStatus.FALHA_ALTERACAO]: "Falha na alteração no Pacs",
        [PacsSyncStatus.FALHA_EXCLUSAO]: "Falha na exclusão no Pacs",
        [PacsSyncStatus.FALHA_CONEXAO]: "Falha na conexão com Pacs",
        [PacsSyncStatus.NAO_CRIADO]: "Não criado no Pacs",
    };

    static getDescription(type: PacsSyncStatus): string {
        return this.descriptions[type] || "Status desconhecido";
    }
}
