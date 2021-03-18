import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContentComponent } from '../layout/content/content.component';
import { LoginComponent } from '../layout/components/login/login.component';
import { SignupComponent } from '../layout/components/signup/signup.component';
import { ResetPasswordRequestComponent } from '../layout/components/reset-password-request/reset-password-request.component';
import { ResetPasswordComponent } from '../layout/components/reset-password/reset-password.component';
import { AuthActionSettingsComponent } from '../layout/components/auth-action-settings/auth-action-settings.component';


const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
  
    },
    {
      path: 'signup',
      component: SignupComponent,

  },
  {
    path: 'action',
    component: AuthActionSettingsComponent,

},
  {
    path: 'forgot',
    component: ResetPasswordRequestComponent,

},

    
    {
        path: 'auth',
        pathMatch: 'full',
        redirectTo: 'auth/login'
  
    },
    
]




@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}