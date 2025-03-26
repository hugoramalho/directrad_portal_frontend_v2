/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

export enum UserGroups {
    ADMIN = 1,
    CLINICA = 2,
    TECNICO = 3,
    PACS_ADMIN = 4,
}

export class UserGroupsMapper {
    private static readonly descriptions: Record<UserGroups | number, string> = {
        [UserGroups.ADMIN]: "Administrador do Sistema",
        [UserGroups.CLINICA]: "Usuário Clínica",
        [UserGroups.TECNICO]: "Usuário Técnico",
        [UserGroups.PACS_ADMIN]: "Administrador do Pacs",
    };

    static getDescription(type: UserGroups | number | string): string {
        type = Number(type);
        return this.descriptions[type] || "Tipo desconhecido";
    }
}
