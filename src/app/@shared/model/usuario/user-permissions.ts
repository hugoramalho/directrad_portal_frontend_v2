/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 10/03/2025
 **/

// export interface UserPermissions {
//     id: string;
//     user_id: string;
//     enable_create_access: boolean;
//     enable_delete_exam: boolean;
//     enable_link_ris: boolean;
//     enable_export_exam: boolean;
//     enable_merge: boolean;
//     enable_group_selected_exams: boolean;
//     enable_delete_series: boolean;
//     enabled_modalities: string[]; // Lista de modalidades permitidas
//     enable_edit_study: boolean | null;
//     created_at: string | null;
//     updated_at: string | null;
//     created_user_id: string | null;
//     updated_user_id: string | null;
// }


export class UserPermissions {
    id: number | string;
    user_id: string | null;
    enable_create_access: boolean | null;
    enable_delete_exam: boolean | null;
    enable_link_ris: boolean | null;
    enable_export_exam: boolean | null;
    enable_merge: boolean | null;
    enable_group_selected_exams: boolean | null;
    enable_delete_series: boolean | null;
    enabled_modalities: string[] | null;
    enable_edit_study: boolean | null;
    created_at: string | null;
    updated_at: string | null;
    created_user_id: string | null;
    updated_user_id: string | null;

    constructor(data: any) {
        this.id = data.id;
        this.user_id = data?.user_id;
        this.enable_create_access = data?.enable_create_access === "1";
        this.enable_delete_exam = data?.enable_delete_exam === "1";
        this.enable_link_ris = data?.enable_link_ris === "1";
        this.enable_export_exam = data?.enable_export_exam === "1";
        this.enable_merge = data?.enable_merge === "1";
        this.enable_group_selected_exams = data?.enable_group_selected_exams === "1";
        this.enable_delete_series = data?.enable_delete_series === "1";
        this.enabled_modalities = data?.enabled_modalities || [];
        this.enable_edit_study = data?.enable_edit_study === "1" ? true : data?.enable_edit_study;
        this.created_at = data?.created_at;
        this.updated_at = data?.updated_at;
        this.created_user_id = data?.created_user_id;
        this.updated_user_id = data?.updated_user_id;
    }
}
