import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Account } from '../account/account.model';
import { User } from '../../user/user.model';
import { Transaction } from './transaction.model';
import { Decimal } from 'decimal.js-light';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  private user: User;
  public account: Account = new Account();
  public transaction: Transaction = new Transaction();
  public isSaving: boolean;
  public buttonLabel: string = "Submit";

  constructor(
    private db: AngularFireDatabase,
    private fbAuth: AngularFireAuth,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.accountService.onLoaded().subscribe(() => {}, () => {}, () => {
      this.account = this.accountService.getSelectedAccount();
      if (this.account){
        this.setUpTransaction();
      }
      this.accountService.selectedAccountChange.subscribe(account => {
        this.account = account;
        this.setUpTransaction();
      })
    })
  }

  setUpTransaction(): void {
    if (!this.account.lastTransaction || !this.account.lastTransaction.transactionId){
      this.transaction.allowance = this.account.allowance;
    } else {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const lastTransactionMonth = this.account.lastTransaction.dateTimeLocalJs.getMonth();

      if (currentMonth > lastTransactionMonth) {
        this.transaction.allowance = new Decimal(this.account.lastTransaction.allowance).toDecimalPlaces(2).plus(new Decimal(this.account.allowance).toDecimalPlaces(2)).toNumber();
      } else {
        this.transaction.allowance = this.account.lastTransaction.allowance;
      }
    }
  }

  saveTransaction(): void {
    this.isSaving = true;
    this.buttonLabel = "Submitting";
    const transactionsRef = this.db.list('/transactions/' + this.account.accountId);

    this.transaction.allowance = new Decimal(this.transaction.allowance).minus(new Decimal(this.transaction.value)).toNumber();
    this.transaction.dateTimeUtc = new Date().toISOString();
    const transactionRef = transactionsRef.push(this.transaction);
    
    transactionRef.then(() => {
      this.transaction.transactionId = transactionRef.key;
      transactionRef.set(this.transaction).then(() => {
        this.buttonLabel = "Success!";
        this.account.lastTransaction = this.transaction;
        this.transaction = new Transaction();
        this.accountService.updateAccount(this.account).then(() => {
          setTimeout(() => {
            this.buttonLabel = "Submit";
            this.isSaving = false;
          }, 2000);
        })
      })
    })
  }
}
