// // auth.selectors.ts
//
// import { createFeatureSelector, createSelector } from '@ngrx/store';
// import { AuthState } from './auth.reducer';
//
// // Pega o slice 'auth' do AppState
// export const selectAuthState = createFeatureSelector<AuthState>('auth');
//
// // Seletores simples
// export const selectUser = createSelector(
//     selectAuthState,
//     (state) => state.user
// );
//
// export const selectToken = createSelector(
//     selectAuthState,
//     (state) => state.token
// );
//
// export const selectPacsTitle = createSelector(
//     selectAuthState,
//     (state) => state.pacsTitle
// );
//
// export const selectAuthLoading = createSelector(
//     selectAuthState,
//     (state) => state.loading
// );
//
// export const selectAuthError = createSelector(
//     selectAuthState,
//     (state) => state.error
// );
