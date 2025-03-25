/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 23/03/2025
 **/


export class UserRis {
    id: number;
    username: string;
    email?: string | null;
    full_name?: string | null;
    admin_id: number | null;
    tele_id?: number | null;
    clinica_id?: string | null;

    constructor(data: any) {
        this.id = data.id;
        this.username = data.username || null;
        this.email = data.email || null;
        this.full_name = data.full_name || null;
        this.admin_id = data.admin_id || null;
        this.tele_id = data.tele_id || null;
        this.clinica_id = data.clinica_id || null;
    }
}
