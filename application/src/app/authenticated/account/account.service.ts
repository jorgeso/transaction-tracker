import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Account } from '../account/account.model';
import { User } from '../../user/user.model';

@Injectable()
export class AccountService {
  private acctSubscriptions: any;
  private accounts: any;
  private accountsArray: Array<Account>;
  private selectedAccount: Account;
  private isLoaded: boolean;
  private onLoadedSubscription: Subject<boolean>;
  public accountsChange: Subject<Array<Account>>;
  public selectedAccountChange: Subject<Account>;
  private acctReferences: any;

  constructor(
    private db: AngularFireDatabase,
    private fbAuth: AngularFireAuth
  ) {
    this.isLoaded = false;
    this.acctSubscriptions = {};
    this.acctReferences = {};
    this.accounts = {};
    this.accountsChange = new Subject();
    this.selectedAccountChange = new Subject();
    this.onLoadedSubscription = new Subject();

    this.initialize();
  }

  private initialize():void {
    
    this.fbAuth.authState.subscribe(auth => {
      
      if (auth) {

        const userRef = this.db.object('users/' + auth.uid);

        userRef.valueChanges().subscribe((user: User) => {

          if (user && user.accounts && Object.keys(user.accounts).length > 0) {
            this.setAccounts(user);
          } else {
            this.accountsChange.next(null);
            this.selectedAccountChange.next(null);
            this.onLoadedSubscription.complete();
          }
          
        })
      }
    });
  }

  private setAccounts(user: User): void {

    const keys = Object.keys(user.accounts);
    let last = keys[keys.length-1];

    keys.forEach(key => {
      
      if (!this.acctSubscriptions[key]){
        this.acctReferences[key] = this.db.object('/accounts/' + key);
        this.acctSubscriptions[key] = this.acctReferences[key].valueChanges();

        this.acctSubscriptions[key].subscribe((account: Account) => {
          this.accounts[key] = new Account(account);

          this.setSelectedAccout(account.accountId);
    
          if (key === last || this.isLoaded){
            last = null;
            this.updateAccountsArray();
          }
        });
      }

    });

  }

  private updateAccountsArray () {

    let accountsArray = [];

    Object.keys(this.accounts).forEach(key => {
      accountsArray.push(this.accounts[key]);
    });

    if (!this.isLoaded) {
      this.isLoaded = true;
      this.onLoadedSubscription.complete();
    }

    this.accountsArray = accountsArray;
    this.accountsChange.next(this.accountsArray);
  }

  public getAccountsArray (): Array<Account> {
    return this.accountsArray;
  }

  public setSelectedAccout (accountId: string) {
    if (!this.selectedAccount || this.selectedAccount.accountId == accountId){
      this.selectedAccount = this.accounts[accountId];
      this.selectedAccountChange.next(this.selectedAccount);
    }
  }

  public getSelectedAccount (): Account {
    return this.selectedAccount;
  }

  public onLoaded(): Observable<boolean> {
    return Observable.create(observer => {

      if (this.isLoaded) {
        observer.complete(true);
      } else {
        this.onLoadedSubscription.subscribe(() => {

        }, error => {

        }, () => {
          observer.complete(true)
        })
      }
    });
  }

  public updateAccount(account: Account): Promise<Account> {
    return this.acctReferences[account.accountId].set(account);
  }
}
