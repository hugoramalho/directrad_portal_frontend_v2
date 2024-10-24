/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/
import {AppResource} from "./app-resource";

export interface Conta extends AppResource{
  nome?: string;
  tipo_conta?: number;
  saldo_inicial?: number|null;
  data_saldo_inicial?: Date|null;
  numero_conta?: string|null;
  agencia_conta?: string|null;
  chave_pix?: string|null;
  tipo_chave_pix?: string|null;
  ispb?: string|null;
  compe?: string|null;
  observacao?: string|null;
}
