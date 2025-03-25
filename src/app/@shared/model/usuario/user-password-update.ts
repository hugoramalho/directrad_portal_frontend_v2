/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

export interface UserPasswordUpdate
{
    user_id: number | string;
    password?: string | null | undefined;
    new_password: string | null;
}
