/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

export interface PaginatedListInterface<T> {
    total: number;
    count: number;
    page: number;
    page_size: number;
    items: T|[];
}
