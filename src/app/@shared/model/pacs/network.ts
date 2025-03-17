/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 07/03/2025
 **/

export interface Aetitle {
    id: number | string;
    pacs_index?: number | null;
    pacs_application_id?: number | null;
    pacs_id?: number | null;
    name: string | null;
    host: string | null;
    port: number | null;
    type: string | null;
    protocol: string | null;
    status_sincronizacao_pacs: string | null;
    ultima_sincronizacao_pacs: string | null;
    created_at: string;
    updated_at?: string | null;
    created_user_id: number | null;
    updated_user_id?: number | null;
}
