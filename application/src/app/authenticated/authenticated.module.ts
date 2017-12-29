import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core/core.component';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { TransactionComponent } from './transaction/transaction.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AccountComponent } from './account/account.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AccountDialogComponent } from './account-dialog/account-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    AuthenticatedRoutingModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule
  ],
  declarations: [
    TransactionComponent,
    CoreComponent,
    AccountComponent,
    AccountDialogComponent
  ],
  providers: [],
  entryComponents: [
    AccountDialogComponent
  ]
})
export class AuthenticatedModule { }
