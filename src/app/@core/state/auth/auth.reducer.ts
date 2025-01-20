// // auth.reducer.ts
//
// import { createReducer, on } from '@ngrx/store';
// import * as AuthActions from './auth.actions';
// import { User } from '../../models/user.model';
//
// export interface AuthState {
//     user: User | null;
//     token: string | null;
//     pacsTitle: string;
//     loading: boolean;     // por exemplo, controlar spinner de login
//     error: any;
// }
//
// // estado inicial
// export const initialState: AuthState = {
//     user: null,
//     token: null,
//     pacsTitle: '',
//     loading: false,
//     error: null
// };
//
// // cria o reducer
// export const authReducer = createReducer(
//     initialState,
//
//     // dispara quando o login é iniciado
//     on(AuthActions.login, (state) => ({
//         ...state,
//         loading: true,
//         error: null
//     })),
//
//     // login com sucesso
//     on(AuthActions.loginSuccess, (state, { user, token }) => ({
//         ...state,
//         user,
//         token,
//         loading: false,
//         error: null
//     })),
//
//     // login com erro
//     on(AuthActions.loginFailure, (state, { error }) => ({
//         ...state,
//         loading: false,
//         error
//     })),
//
//     // logout
//     on(AuthActions.logout, (state) => ({
//         ...state,
//         user: null,
//         token: null,
//         pacsTitle: ''
//     })),
//
//     // seta o PACS
//     on(AuthActions.setPacs, (state, { pacsTitle }) => ({
//         ...state,
//         pacsTitle
//     }))
// );
