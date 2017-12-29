import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { TransactionComponent } from './transaction/transaction.component';
import { AccountComponent } from './account/account.component';

const childrenRoutes: Routes = [
  {
    path: "transaction",
    component: TransactionComponent
  },
  {
    path: "account",
    component: AccountComponent
  }
];

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: childrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticatedRoutingModule { }
