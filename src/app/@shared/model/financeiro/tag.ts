/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/
import {AppResource} from "./app-resource";


export interface Tag extends AppResource{
  nome: string;
  cor?: string|null;
}
