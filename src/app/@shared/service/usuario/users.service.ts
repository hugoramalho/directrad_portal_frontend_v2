/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 18/03/2025
 **/


import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { User } from '../../model/usuario/user';
import {UsersRepository} from "../../repository/user/users.repository";
import {Aetitle} from "../../model/pacs/aetitle";
import {PaginatedList} from "../../model/http/paginated-list";

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

    queryTeles()
    {
        return this.usersRepository.queryTeles();
    }

    queryAdmins()
    {
        return this.usersRepository.queryAdmins();
    }

    queryAdminsPaginated(page: number = 1, page_size: number = 20, queryParams: Record<string, any> | null = null)
    {
        return this.usersRepository.queryAdminsPaginated(page, page_size, queryParams);
    }

    queryPaginated(page: number = 1, page_size: number = 20, queryParams: Record<string, any> | null = null)
    {
        return this.usersRepository.queryPaginated(page, page_size, queryParams);
    }

    query(params: {} = {}){
        return this.usersRepository.query(params);
    }

    search(
        allUsers: User[],
        page: number = 1,
        pageSize: number = 10,
        filters: Record<string, any> = {}
    ): PaginatedList<User[]> {
        let filtered = [...allUsers];
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                filtered = filtered.filter(user => {
                    const userValue = user[key as keyof User];
                    if (userValue === undefined || userValue === null) return false;
                    const valueIsNumber = !isNaN(Number(value));
                    const userValueIsNumber = !isNaN(Number(userValue));
                    if (valueIsNumber && userValueIsNumber) {
                        return Number(userValue) === Number(value);
                    }
                    return userValue.toString().toLowerCase().includes(value.toString().toLowerCase());
                });
            }
        });
        const total = filtered.length;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);
        return {
            count: paginated.length,
            items: paginated,
            total: total,
            page: page,
            page_size: pageSize,
        };
    }


}
