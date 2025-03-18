/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 18/03/2025
 **/
import {Pacs} from "./pacs";
import {PacsHostMapper, PacsHostType} from "./pacs-host-type";

export class PacsElement {
    id: number | string;
    identificacao: string | null | undefined;
    ip:  string | null | undefined;
    dominio: string | null | undefined;
    tipo_pacs_application: string | null | undefined;
    username_tele: string;
    username_admin: string;
    main_storage_aetitle: string;
    host: string;
    // created_at: string;
    // created_user_id: number;
    // updated_at: string;
    // updated_user_id: number;

    static fromPacs(pacs: Pacs): PacsElement {
        let pacsElement = new PacsElement();
        pacsElement.id = pacs.id;
        pacsElement.identificacao = pacs.identificacao;
        pacsElement.ip = pacs.ip;
        pacsElement.dominio = pacs.dominio;
        pacsElement.host = PacsHostMapper.getDescription(pacs.tipo_pacs_application as PacsHostType);
        pacsElement.tipo_pacs_application = pacs.tipo_pacs_application;
        return pacsElement;
    }
}

