/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 07/03/2025
 **/
import {UserPermissions} from "../usuario/user-permissions";
import {AbstractModel} from "../abstract-model";

export interface Pacs {
    id: number | string;
    identificacao?: string | null;
    pacs_application_id?: number | null;
    dominio?: string | null;
    ip?: string | null;
    porta_wado?: number | null;
    porta_wkl?: number | null;
    porta_api?: number | null;
    porta_nginx?: number | null;
    porta_ssl?: number | null;
    porta_dicom?: number | null;
    aet_principal?: number | null;
    aet_worklist?: number | null;
    has_ssl?: boolean | null;
    pacs_version?: number | null;
    tele_id?: number | null;
    cliente_id?: number | null;
    pacs_ram_config?: number | null;
    install_serial?: string | null;
    install_allow?: boolean | null;
    active?: boolean | null;
    admin_id?: number | null;
    worklist_ip?: string | null;
    ip_local?: string | null;
    porta_wado_local?: number | null;
    quantidade_threads?: number | null;
    tamanho_pool?: number | null;
    tipo_pacs?: string | null;
    tipo_pacs_application?: string | null;
    pacs_credentials_id?: number | null;
    pacs_ssh_credentials_id?: number | null;
    status_sincronizacao_pacs?: string | null;
    ultima_sincronizacao_pacs?: string | null;
    status_normalizacao_tabela?: string | null;
    created_at?: string | null;
    created_user_id?: number | null;
    updated_at?: string | null;
    updated_user_id?: number | null;
    trash?: boolean | null;
    //
    username_tele?: string | null | undefined;
    username_admin?: string | null | undefined;
    main_storage_aetitle?: string | null | undefined;
    host?: string | null | undefined;
}

//
// export class Pacs extends AbstractModel {
//     id: string;
//     identificacao?: string | null;
//     pacs_application_id?: number | null;
//     dominio?: string | null;
//     ip?: string | null;
//     porta_wado?: number | null;
//     porta_wkl?: number | null;
//     porta_api?: number | null;
//     porta_nginx?: number | null;
//     porta_ssl?: number | null;
//     porta_dicom?: number | null;
//     aet_principal?: number | null;
//     aet_worklist?: number | null;
//     has_ssl?: boolean | null;
//     pacs_version?: number | null;
//     tele_id?: number | null;
//     cliente_id?: number | null;
//     pacs_ram_config?: number | null;
//     install_serial?: string | null;
//     install_allow?: boolean | null;
//     active?: boolean | null;
//     admin_id?: number | null;
//     worklist_ip?: string | null;
//     ip_local?: string | null;
//     porta_wado_local?: number | null;
//     quantidade_threads?: number | null;
//     tamanho_pool?: number | null;
//     tipo_pacs?: string | null;
//     tipo_pacs_application?: string | null;
//     pacs_credentials_id?: number | null;
//     pacs_ssh_credentials_id?: number | null;
//     status_sincronizacao_pacs?: string | null;
//     ultima_sincronizacao_pacs?: string | null;
//     status_normalizacao_tabela?: string | null;
//     //
//     created_at?: string | null;
//     created_user_id?: number | null;
//     updated_at?: string | null;
//     updated_user_id?: number | null;
//     trash?: boolean | null;
//
//     constructor(data: any) {
//         super(); // Chama o construtor da classe pai (BaseModel)
//
//         this.id = this.toNumber(data.id)!; // id nunca pode ser null
//         this.identificacao = data.identificacao ?? null;
//         this.pacs_application_id = this.toNumber(data.pacs_application_id);
//         this.dominio = data.dominio ?? null;
//         this.ip = data.ip ?? null;
//         this.porta_wado = this.toNumber(data.porta_wado);
//         this.porta_wkl = this.toNumber(data.porta_wkl);
//         this.porta_api = this.toNumber(data.porta_api);
//         this.porta_nginx = this.toNumber(data.porta_nginx);
//         this.porta_ssl = this.toNumber(data.porta_ssl);
//         this.porta_dicom = this.toNumber(data.porta_dicom);
//         this.aet_principal = this.toNumber(data.aet_principal);
//         this.aet_worklist = this.toNumber(data.aet_worklist);
//         this.has_ssl = this.toBoolean(data.has_ssl);
//         this.pacs_version = this.toNumber(data.pacs_version);
//         this.tele_id = this.toNumber(data.tele_id);
//         this.cliente_id = this.toNumber(data.cliente_id);
//         this.pacs_ram_config = this.toNumber(data.pacs_ram_config);
//         this.install_serial = data.install_serial ?? null;
//         this.install_allow = this.toBoolean(data.install_allow);
//         this.active = this.toBoolean(data.active);
//         this.admin_id = this.toNumber(data.admin_id);
//         this.worklist_ip = data.worklist_ip ?? null;
//         this.ip_local = data.ip_local ?? null;
//         this.porta_wado_local = this.toNumber(data.porta_wado_local);
//         this.quantidade_threads = this.toNumber(data.quantidade_threads);
//         this.tamanho_pool = this.toNumber(data.tamanho_pool);
//         this.tipo_pacs = data.tipo_pacs ?? null;
//         this.tipo_pacs_application = data.tipo_pacs_application ?? null;
//         this.pacs_credentials_id = this.toNumber(data.pacs_credentials_id);
//         this.pacs_ssh_credentials_id = this.toNumber(data.pacs_ssh_credentials_id);
//         this.status_sincronizacao_pacs = data.status_sincronizacao_pacs ?? null;
//         this.ultima_sincronizacao_pacs = data.ultima_sincronizacao_pacs ?? null;
//         this.status_normalizacao_tabela = data.status_normalizacao_tabela ?? null;
//         this.created_at = data.created_at ?? null;
//         this.created_user_id = this.toNumber(data.created_user_id);
//         this.updated_at = data.updated_at ?? null;
//         this.updated_user_id = this.toNumber(data.updated_user_id);
//         this.trash = this.toBoolean(data.trash);
//     }
// }
