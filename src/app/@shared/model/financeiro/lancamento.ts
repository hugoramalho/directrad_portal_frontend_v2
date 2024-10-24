/**
 Created by: Hugo Ramalho <ramalho.hg@gmail.com>

 Created at: 28/03/2024
 **/


import {Tag} from './tag';
import {Conta} from "./conta";
import {FormaPagamento} from "./forma-pagamento";
import {CentroCusto} from "./centro-custo";
import {Categoria} from "./categoria";
import {AppResource} from "./app-resource";

export interface Lancamento extends AppResource{
  uuid?: string|null;
  descricao?: string|null;
  data_efetiva: Date;
  data_competencia?: Date|null;
  valor: number;
  status: boolean;
  categoria_id: number;
  categoria?: Categoria|null;
  centro_custo?: CentroCusto|null;
  centro_custo_id?: number|null;
  forma_pagamento?: FormaPagamento|null;
  forma_pagamento_id?: number|null;
  conta_origem?: Conta|null;
  conta_origem_id?: number|null;
  conta_destino?: Conta|null;
  conta_destino_id?: number|null;
  tags_id?: number[]|null;
  tags?: Tag[]|null;
}
