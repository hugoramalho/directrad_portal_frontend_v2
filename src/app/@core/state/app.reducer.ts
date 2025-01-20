// // store/index.ts
//
// import { ActionReducerMap, MetaReducer } from '@ngrx/store';
// import { environment } from '../../environments/environment';
// import * as fromAuth from './auth/auth.reducer';
//
// export interface AppState {
//     auth: fromAuth.AuthState;
//     // outros slices se tiver
// }
//
// export const reducers: ActionReducerMap<AppState> = {
//     auth: fromAuth.authReducer
// };
//
// export const metaReducers: MetaReducer<AppState>[] = !environment.production
//     ? []
//     : [];
