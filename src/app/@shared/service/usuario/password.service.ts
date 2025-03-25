/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import { Injectable } from '@angular/core';
import { User } from '../../model/usuario/user';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs";
import {UserPasswordUpdate} from "../../model/usuario/user-password-update";
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PasswordService
{
    private baseUrl = `${environment.api_v1_base_url}/users`;

    constructor(
        private http: HttpClient
    ) {
    }

    updatePassword(passwordUpdateData: UserPasswordUpdate)
    {
        return this.http.put<ApiResponseInterface<any>>(
            `${this.baseUrl}/${passwordUpdateData.user_id}/password`,
            passwordUpdateData
        );
    }

}
