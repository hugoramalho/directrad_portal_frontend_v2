/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 24/03/2025
 **/

import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Pacs} from "../../model/pacs/pacs";
import {PacsNetworkRepository} from "../../repository/pacs/network.repository";

@Injectable({
    providedIn: 'root',
})
export class PacsNetworkService {

    private apiUrl = `${environment.api_v1_base_url}`;

    constructor(
        private pacsNetworkRepository: PacsNetworkRepository,
    ) {
    }

    create(pacsData: Pacs)
    {
        // return this.pacsNetworkRepository.create(pacsData);
    }

    update(pacsData: Pacs)
    {
        // return this.pacsNetworkRepository.update(pacsData);
    }

    find(id: number | string)
    {
        // return this.pacsNetworkRepository.find(id);
    }

    get(page: number = 1, page_size: number = 10, queryParams: Record<string, any> | null = null)
    {
        // return this.pacsNetworkRepository.get(page, page_size, queryParams);
    }

    query(pacsId: number | string | undefined, queryParams: Record<string, any> | null = null)
    {
        return this.pacsNetworkRepository.query(pacsId, queryParams);
    }

}
