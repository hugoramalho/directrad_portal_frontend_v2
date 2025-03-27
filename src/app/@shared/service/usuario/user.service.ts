/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../model/usuario/user';
import {UsersRepository} from "../../repository/user/users.repository";
import {UserRepository} from "../../repository/user/user.repository";
import {UserGroups} from "../../model/usuario/user-groups";



@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private userRepository: UserRepository
    ) {
        this.loadUserFromStorage();
    }

    /** Guarda o usuário logado */
    setUser(apiUser: any): void {
        const user = new User(apiUser); // Cria uma instância automaticamente convertida
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    verifyGroup(groupId: number | string): boolean {
        return this.userSubject.getValue()?.groups?.some(group => group.group_id == groupId) ?? false;
    }

    update(user: User)
    {
        return this.userRepository.update(user);
    }


    /** Obtém o usuário */
    getUser(): User | null {
        return this.userSubject.getValue();
    }

    /** Carrega o usuário do localStorage após refresh */
    private loadUserFromStorage(): void {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            this.userSubject.next(new User(JSON.parse(storedUser)));
        }
    }

    /** Remove os dados do usuário no logout */
    clearUser(): void {
        localStorage.removeItem('user');
        this.userSubject.next(null);
    }

    /** Verifica se o usuário é admin */
    isAdmin(): boolean {
        return this.verifyGroup(UserGroups.ADMIN);
    }
}
