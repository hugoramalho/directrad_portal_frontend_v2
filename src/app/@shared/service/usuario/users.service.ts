/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 18/03/2025
 **/


import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../../model/usuario/user';
import {UsersRepository} from "../../repository/user/users.repository";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private usersRepository: UsersRepository,
    ) {
    }

    queryAllTele()
    {
        return this.usersRepository.queryAllTele();
    }

    queryAllAdmins()
    {
        return this.usersRepository.queryAllAdmins();
    }

    queryAdmin(page: number = 1, page_size: number = 20, queryParams: Record<string, any> | null = null)
    {
        return this.usersRepository.queryAdmin(page, page_size, queryParams);
    }

    query(page: number = 1, page_size: number = 20,  queryParams: Record<string, any> | null = null)
    {
        return this.usersRepository.query(page, page_size, queryParams);
    }

}
