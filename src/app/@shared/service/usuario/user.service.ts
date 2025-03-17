/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../model/usuario/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor() {
        this.loadUserFromStorage();
    }

    /** Guarda o usuário logado */
    setUser(apiUser: any): void {
        const user = new User(apiUser); // Cria uma instância automaticamente convertida
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
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
        return this.getUser()?.groups?.some(group => group.group_id === 'admin') ?? false;
    }
}
