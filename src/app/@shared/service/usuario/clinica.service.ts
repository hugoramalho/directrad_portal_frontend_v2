/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 18/03/2025
 **/

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../model/usuario/user';
import {ClinicaRepository} from "../../repository/user/clinica.repository";

@Injectable({
    providedIn: 'root'
})
export class ClinicaService {
    private userSubject = new BehaviorSubject<User | null>(null);
    user$ = this.userSubject.asObservable();

    constructor(
        private clinicaRepository: ClinicaRepository,
    ) {
    }

    query() {
        return this.clinicaRepository.get();
    }

}
