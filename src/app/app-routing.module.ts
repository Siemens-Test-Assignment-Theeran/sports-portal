import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guard/auth.guard';
import { LoginComponent } from './unprotected/login/login.component';
import { MainComponent } from './protected/main/main.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: MainComponent, canActivate: [AuthGuard], data: { path : 'main'}},
    // { path: '', component: MainComponent},
    { path: 'addUpdatePlayer', component: MainComponent, canActivate: [AuthGuard], data: { path : 'addUpdate'}},
    { path: 'player/:id/:name', component: MainComponent, canActivate: [AuthGuard], data: { path : 'player'}},
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}