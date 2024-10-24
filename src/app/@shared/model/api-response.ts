/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 09/04/2024
 **/

import { ApiError } from './api-error';

export interface ApiResponse<T> {
  success: boolean;
  data?: T|null;
  error?: ApiError;
}
