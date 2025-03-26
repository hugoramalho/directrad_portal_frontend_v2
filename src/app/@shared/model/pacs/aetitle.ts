/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 07/03/2025
 **/


export interface Aetitle {
    id: number | string;
    uuid?: string | null;
    pacs_index?: number;
    is_main_aetitle?: boolean;
    pacs_id: number | null;
    pacs_application_id?: number | null;
    aetitle: string;
    aetitle_new_name?: string | null;
    aetitle_destino?: number | null;
    tipo: string | null;
    description?: string | null;
    clinica_id?: number | null;
    excluido?: number | null;
    status_sincronizacao_pacs?: string | null;
    ultima_sincronizacao_pacs?: string | null;
    created?: string | null;
    updated?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    created_user_id?: number | null;
    updated_user_id?: number | null;
    //------------------------------------------------------------------------------------------------------------------
    pacs_relacionado?: string | null | undefined;
    clinica_relacionada?: string | null | undefined;
    status?: string | undefined | null;
    tipo_aetitle?: string | null | undefined;
}
