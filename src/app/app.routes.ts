import {Routes} from '@angular/router';
import {NotFoundComponent} from './common/not-found/not-found.component';
import {EstudosComponent} from './estudos/estudos.component';
import {AccountSettingsComponent} from "./usuario/conta/account-settings.component";
import {PacsControleComponent} from './painel-controle/pacs-controle.component';
import {SuporteUsuarioComponent} from "./usuario/suporte/suporte-usuario.component";
import {UsuarioComponent} from "./usuario/usuario.component";
import {WorklistComponent} from "./worklist/exame/worklist.component";
import {CadastroUsuarioComponent} from "./cadastro/usuario/user.component";
import {CadastroComponent} from "./cadastro/cadastro.component";
import {AuthenticationComponent} from "./auth/authentication.component";
import {SignInComponent} from "./authentication/sign-in/sign-in.component";
import {SignUpComponent} from "./authentication/sign-up/sign-up.component";
import {ForgotPasswordComponent} from "./authentication/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./authentication/reset-password/reset-password.component";
import {LockScreenComponent} from "./authentication/lock-screen/lock-screen.component";
import {ConfirmEmailComponent} from "./authentication/confirm-email/confirm-email.component";
import {LogoutComponent} from "./authentication/logout/logout.component";
import {AuthGuard} from "./@shared/guards/auth.guard";

export const routes: Routes = [
    {
        path: '', component: EstudosComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'authentication',
        component: AuthenticationComponent,
        children: [
            {path: '', component: SignInComponent},
            {path: 'sign-up', component: SignUpComponent},
            {path: 'forgot-password', component: ForgotPasswordComponent},
            {path: 'reset-password', component: ResetPasswordComponent},
            {path: 'lock-screen', component: LockScreenComponent},
            {path: 'confirm-email', component: ConfirmEmailComponent},
            {path: 'logout', component: LogoutComponent}
        ]
    },
    {
        path: 'login',
        component: AuthenticationComponent,
    },
    {
        path: 'exames', component: EstudosComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'worklist', component: WorklistComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'painel-controle',
        canActivate: [AuthGuard],
        component: PacsControleComponent,
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: PacsControleComponent
            },
            // {path: 'suporte', component: SuporteUsuarioComponent},
            // {path: 'config', component: AccountSettingsComponent}
        ]
    },
    {
        path: 'cadastros',
        canActivate: [AuthGuard],
        component: CadastroComponent,
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: CadastroComponent
            },
            {
                path: 'usuarios',
                canActivate: [AuthGuard],
                component: CadastroUsuarioComponent
            },
        ]
    },
    {
        path: 'usuario',
        canActivate: [AuthGuard],
        component: UsuarioComponent,
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: AccountSettingsComponent
            },
            // {path: 'suporte', component: SuporteUsuarioComponent},
            {
                path: 'config',
                canActivate: [AuthGuard],
                component: AccountSettingsComponent
            }
        ]
    },

    {path: '**', component: NotFoundComponent} // This line will remain down from the whole pages component list
];
