/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

import { ApiError } from './api-error';


export interface ApiResponsePaginated<T> {
  success: boolean;
  error?: ApiError;
  data?: T;
}
