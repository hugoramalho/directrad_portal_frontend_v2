/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/12/2024
 **/

export interface ApplicationEntity {
    id?: number | null;
    aetitle: string;
    tipo_aetitle: string;
    pacs_id: number;
    clinica_id?: number | null;
    network_name?: string | null;
    network_host?: string | null;
    network_port?: number | null;
    access_control_ids?: [] | null;
}
