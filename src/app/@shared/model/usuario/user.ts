/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

// export interface User {
//     id: number;
//     username: string;
//     permissoes?: string[];
//     tipo_usuario?: string | null;
//     company?: string | null;
//     clinica_id?: number | null;
//     tele_id?: number | null;
//     excluded?: boolean | null;
//     active?: boolean | null;
//     email?: string | null;
//     phone?: string | null;
//     groups?: { id: string; user_id: string; group_id: string }[];
//     permissions: T;
// }
// export interface User<T = any> {
//     id: string;
//     username: string;
//     first_name?: string;
//     last_name: string;
//     email?: string | null;
//     phone?: string | null;
//     company?: string | null;
//     tipo_usuario?: string | null;
//     active?: boolean;
//     excluded: boolean;
//     pacs_id: string;
//     aetitle_id?: string | null;
//     clinica_id?: string | null;
//     tele_id: string | null;
//     parent_id: string | null;
//     last_login: string;
//     created_on: string;
// }
import { UserPermissions } from "./user-permissions";

export class User {
    id: number;
    username: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    tipo_usuario: string | null;
    active: boolean;
    excluded?: boolean | null;
    pacs_id: string;
    aetitle_id?: string | null;
    clinica_id?: string | null;
    tele_id?: string | null;
    parent_id?: string | null;
    last_login?: string | null;
    created_on?: string | null;
    groups: { id: string; user_id: string; group_id: string }[];
    permissions?: UserPermissions | null;

    constructor(data: any) {
        this.id = data.id;
        this.username = data.username;
        this.company = data.company;
        this.tipo_usuario = data.tipo_usuario;
        this.active = data.active === "1";
        this.excluded = data.excluded === "1";
        this.pacs_id = data.pacs_id;
        this.aetitle_id = data.aetitle_id;
        this.clinica_id = data.clinica_id;
        this.tele_id = data.tele_id;
        this.parent_id = data.parent_id;
        this.last_login = data.last_login;
        this.created_on = data.created_on;
        this.groups = data.groups || [];
        this.permissions = new UserPermissions(data.permissions); // Converte permissões automaticamente
    }
}
