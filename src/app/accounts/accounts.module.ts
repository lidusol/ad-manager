import { NgModule } from '@angular/core';
import { AccountsComponent } from './accounts/accounts.component';
import { LayoutModule } from '../layout/layout.module';
import { AccountsRoutingModule } from './accounts-routing.modules';
import { AccountsService } from './accounts.service';
import { AddFundsComponent, DialogPayment } from './add-funds/add-funds.component';
import { AccountSetupComponent } from './account-setup/account-setup.component';



@NgModule({
  declarations: [AccountsComponent, AddFundsComponent, AccountSetupComponent, DialogPayment],
  imports: [
    LayoutModule,
    AccountsRoutingModule,
  ],
  providers: [],
  entryComponents: [
    DialogPayment
  ]
})
export class AccountsModule { }
