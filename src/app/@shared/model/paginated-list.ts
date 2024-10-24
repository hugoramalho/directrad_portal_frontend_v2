/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

export interface PaginatedList<T> {
    total: number;
    count: number;
    page: number;
    limit: number;
    items: T|null;
}
