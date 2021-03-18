import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../layout/layout.module';
import { AuthRoutingModule } from './auth-routing.modules';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guards';
import { FIREBASE_CREDENTIALS } from 'src/environments/environment';
import { AccountsService } from '../accounts/accounts.service';



@NgModule({
  declarations: [],
  imports: [
    LayoutModule,
    AuthRoutingModule,
  ],
  providers: [AuthService, AuthGuard]
})
export class AuthModule { }
