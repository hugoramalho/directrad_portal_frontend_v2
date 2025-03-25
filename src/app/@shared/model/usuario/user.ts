/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

import { UserPermissions } from "./user-permissions";

export class User {
    id: number;
    username: string;
    email: string | null;
    email_alternativo?: string | null;
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
    nome_completo?: string | null | undefined;
    data_nascimento?: string | null | undefined;
    documento?: string | null | undefined;
    tipo_documento?: string | null | undefined;
    telefone_codigo_pais?: string | null | undefined;
    telefone_codigo_area?: string | null | undefined;
    telefone_numero?: string | null | undefined;
    endereco_cep?: string | null | undefined;
    endereco_logradouro?: string | null | undefined;
    endereco_numero?: string | null | undefined;
    endereco_bairro?: string | null | undefined;
    endereco_estado?: string | null | undefined;
    endereco_cidade?: string | null | undefined;
    endereco_pais?: string | null | undefined;

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
        this.permissions = new UserPermissions(data.permissions);
        this.email = data?.email;
        this.email_alternativo = data?.email_alternativo;
        this.nome_completo = data?.nome_completo;
        this.data_nascimento = data?.data_nascimento;
        this.documento = data?.documento;
        this.tipo_documento = data?.tipo_documento;
        this.telefone_codigo_pais = data?.telefone_codigo_pais;
        this.telefone_codigo_area = data?.telefone_codigo_area;
        this.telefone_numero = data?.telefone_numero;
        this.endereco_cep = data?.endereco_cep;
        this.endereco_logradouro = data?.endereco_logradouro;
        this.endereco_numero = data?.endereco_numero;
        this.endereco_bairro = data?.endereco_bairro;
        this.endereco_cidade = data?.endereco_cidade;
        this.endereco_estado = data?.endereco_estado;
        this.endereco_pais = data?.endereco_pais;
    }
}
