import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Account } from '../account/account.model';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {
  public isRequired: boolean;
  public account: Account = new Account();
  public buttonLabel: string;
  public isSaving: boolean;

  constructor(
    public dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: AngularFireDatabase
  ) {
    this.isRequired = data.isRequired;
    console.log(data);
    if (data.account){
      this.account = data.account;
      this.buttonLabel = "Update";
    } else {
      this.buttonLabel = "Add";
      this.account.transactionTypes = ["Groceries", "Clothes", "Toys", "Entertainment", "Gas", "Food take out", "Dine out/drinks", "Other"];
      this.account.members = {};
      this.account.members[data.uid] = true;
    }

  }

  ngOnInit() {
  }

  save(): void {
    this.isSaving = true;
    if (!this.account.accountId){
      this.buttonLabel = "Adding...";
      const accountsRef = this.db.list('accounts');
      console.log(this.account);
      const accountResponseRef = accountsRef.push(this.account);

      accountResponseRef.then(()=> {
        this.account.accountId = accountResponseRef.key;
        accountResponseRef.set(this.account).then(() => {
          this.buttonLabel = "Added!";
          setTimeout(() => {
            this.dialogRef.close(this.account);
          }, 2000)
        });
      })
    } else {
      const accountRef = this.db.object('/accounts/' + this.account.accountId);
      accountRef.set(this.account).then(() => {
        this.buttonLabel = "Saved!";
        setTimeout(() => {
          this.dialogRef.close(this.account);
        }, 2000);
      });
    }
  }

}
