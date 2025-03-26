/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 25/03/2025
 **/


import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../../model/usuario/user';
import {UsersRepository} from "../../repository/user/users.repository";

@Injectable({
    providedIn: 'root'
})
export class CreateUserService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private usersRepository: UsersRepository,
    ) {
    }

    create(user: any)
    {
        return this.usersRepository.create(user);
    }

}
