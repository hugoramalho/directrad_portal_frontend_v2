/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/03/2025
 **/

import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {PacsRepository} from "../../repository/pacs.repository";
import {AETitleRepository} from "../../repository/aetitle.repository";
import {ExportRuleRepository} from "../../repository/export-rules.repository";
import {UserService} from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class AppInitializerService {
    constructor(
        private pacsRepository: PacsRepository,
        private aetitleRepository: AETitleRepository,
        private exportRulesRepository: ExportRuleRepository,
        private userService: UserService
    ) {}

    async initializeApp(): Promise<void> {
        try {
            // 1. Obtém o usuário logado
            const user = this.userService.getUser();
            if (!user) {
                console.error('Usuário não autenticado!');
                return;
            }

            // // 2. Busca a lista de PACS do usuário
            const pacs = await firstValueFrom(this.pacsRepository.query());
            if (pacs.length === 0) {
                console.error('Nenhum PACS encontrado!');
                return;
            }
            // // 3. Busca os AETitles e ExportRules para cada PACS
            await Promise.all(
                await firstValueFrom(this.aetitleRepository.getAETitles())
            );

        } catch (error) {
            console.error('Erro durante a inicialização do aplicativo:', error);
            return Promise.reject(error);
        }
    }
}

