/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 18/03/2025
 **/


import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../model/usuario/user';
import {TeleRepository} from "../../repository/user/tele.repository";

@Injectable({
    providedIn: 'root'
})
export class TeleUserService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private teleUserRepository: TeleRepository,
    ) {
    }


    query() {
        return this.teleUserRepository.get();
    }

}
