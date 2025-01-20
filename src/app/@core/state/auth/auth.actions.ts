// // auth.actions.ts
//
// import { createAction, props } from '@ngrx/store';
// import { User } from '../../models/user.model';
//
// // Exemplos de ações:
//
// // 1) ação para iniciar um login
// export const login = createAction(
//     '[Auth] Login',
//     props<{ username: string; password: string }>()
// );
//
// // 2) ação para login bem-sucedido
// export const loginSuccess = createAction(
//     '[Auth] Login Success',
//     props<{ user: User; token: string }>()
// );
//
// // 3) ação para login com erro
// export const loginFailure = createAction(
//     '[Auth] Login Failure',
//     props<{ error: any }>()
// );
//
// // 4) logout
// export const logout = createAction('[Auth] Logout');
//
// // 5) configurar PACS (ou outra configuração)
// export const setPacs = createAction(
//     '[Auth] Set PACS',
//     props<{ pacsTitle: string }>()
// );
