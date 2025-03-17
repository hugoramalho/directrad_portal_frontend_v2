/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

import { ApiError } from './api-error';

export interface ApiResponseInterface<T> {
    success: boolean;
    message?: string;
    data?: T|null|any;
    error?: ApiError;
}
