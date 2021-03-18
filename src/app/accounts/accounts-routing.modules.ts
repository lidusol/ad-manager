import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContentComponent } from '../layout/content/content.component';
import {AccountsComponent} from './accounts/accounts.component'
import { AddFundsComponent } from './add-funds/add-funds.component';
import { PaymentsComponent } from '../layout/components/payments/payments.component';
import { TransactionsComponent } from '../layout/components/transactions/transactions.component';
import { AccountsAccessComponent } from '../layout/components/accounts-access/accounts-access.component';
import { UserProfileComponent } from '../layout/components/user-profile/user-profile.component';
import { AccountSetupComponent } from '../accounts/account-setup/account-setup.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'list',
      component: AccountsAccessComponent
  
  },
  {
    path: 'addFunds',
    component: AddFundsComponent
  },
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'profile/:key',
    component: PaymentsComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'setup',
    component: AccountSetupComponent
  }
    ]
  },
  {path: '**', redirectTo: '/accounts/list'},
    
    
]




@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}