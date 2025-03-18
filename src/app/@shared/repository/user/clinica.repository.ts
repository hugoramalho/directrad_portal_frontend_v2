/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 18/03/2025
 **/



import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {ApiResponseInterface} from "../../model/http/api-response-interface";
import {UserClinica} from "../../model/usuario/user-clinica";
import {environment} from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ClinicaRepository {
    private baseUrl = `${environment.api_v1_base_url}/cadastros/ris/clinicas`;
    private clinicsSubject = new BehaviorSubject<Map<number, UserClinica>>(new Map());
    pacs$ = this.clinicsSubject.asObservable();

    constructor(private http: HttpClient) {
    }

    get(): Observable<UserClinica[]> {
        const cachedClinicsMap = this.clinicsSubject.getValue();
        if (cachedClinicsMap.size > 0) {
            return of(Array.from(cachedClinicsMap.values()));
        }
        return this.http.get<ApiResponseInterface<UserClinica[]>>(`${this.baseUrl}`).pipe(
            map(response => response.data || []),
            tap((clinicsArray: UserClinica[]) => {
                const clinicsMap = new Map<number, UserClinica>();
                clinicsArray.forEach(clinic => clinicsMap.set(clinic.id, new UserClinica(clinic)));
                this.clinicsSubject.next(clinicsMap);
            }),
            catchError(err => {
                console.error('Erro ao obter clínicas:', err);
                return of([]);
            })
        );
    }

}
