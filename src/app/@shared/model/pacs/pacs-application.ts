/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 07/03/2025
 **/

export interface PacsApplication {
    id: number | string;
    uuid: string;
    pacs_id: number;
    nome_pacs_server: string;
    ip: string;
    ip_local: string;
    ip_worklist: string;
    dominio: string;
    tipo_pacs_application: string;
    porta_wado: number;
    porta_wado_local: number;
    porta_worklist: number;
    porta_dicom: number;
    porta_http: number;
    porta_https: number;
    porta_api: number;
    serial_instalacao: string;
    status_instalacao: string;
    status_servidor: string;
    user_admin_id: number;
    pacs_application_credentials_id: number;
    pacs_application_host_credentials_id: number;
    aetitle_storage_principal_id: number;
    aetitle_worklist_id: number;
    aetitle_local_id: number;
    config_ram: number;
    config_threads: number;
    config_threads_pool: number;
    versao_pacs: string;
    framework_pacs: string;
    status_sincronizacao_pacs: string;
    ultima_sincronizacao_pacs: string;
    created_at: string;
    created_user_id: number;
    updated_at: string;
    updated_user_id: number;
}

