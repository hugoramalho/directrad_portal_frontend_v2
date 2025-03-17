/**
 * Created by: Hugo Ramalho <ramalho.hg@gmail.com>
 *
 * Created at: 11/03/2025
 **/
import {PaginatedListInterface} from "./paginated-list-interface";

export class PaginatedList<T> implements PaginatedListInterface<T> {
    total: number;
    count: number;
    page: number;
    page_size: number;
    items: T | [];
    constructor(data: Partial<PaginatedListInterface<T>> = {}) {
        this.total = data.total ?? 0;
        this.count = data.count ?? 0;
        this.page = data.page ?? 1;
        this.page_size = data.page_size ?? 10;
        this.items = data?.items ?? [];
    }
}
