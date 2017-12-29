import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from '../../user/user.model';
import { MatDialog } from '@angular/material';
import { AccountDialogComponent } from '../account-dialog/account-dialog.component';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class CoreComponent implements OnInit {
  route: string;
  routeFragments: Array<string>;
  isSideNavOpen: boolean;

  constructor(
    private router: Router,
    public fbAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private dialog: MatDialog
  ) {
    this.isSideNavOpen = false;
  }

  ngOnInit() {

    this.routeFragments = this.router.url.split(/[\/;&?]/);
    this.route = this.routeFragments[1].toLowerCase();

    if (!document.location.pathname || document.location.pathname == "/"){
      this.router.navigate(['/transaction']);
    }

    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.routeFragments = event.url.split(/[\/;&?]/);
        this.route = this.routeFragments[1].toLowerCase();
      }

    })

    var loadingDiv = document.getElementById("loading-element");

    if (loadingDiv){
      document.getElementsByTagName('body')[0].removeChild(loadingDiv);
    }

    this.checkAccounts();
  }

  checkAccounts(): void {
    const authStateSubscription =  this.fbAuth.authState.subscribe(auth => {

      if (auth){

        const userRef = this.db.object('users/' + auth.uid);

        const userSubscription = userRef.valueChanges().subscribe((user: User) => {

          if (!user.accounts || Object.keys(user.accounts).length === 0) {
            this.openAccountDialog(user, userRef);
          }

          userSubscription.unsubscribe();
        });

        
      } else {
        this.router.navigate(['/login']);
      }
      
    }, error => {
      this.router.navigate(['/login']);
    });
  }

  openAccountDialog(user: User, userRef: any) {

    const dialogRef = this.dialog.open(AccountDialogComponent, {
      data: {
        uid: user.uid,
        isRequired: true
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.accountId){
        user.accounts = {}
        user.accounts[result.accountId] = true;
        userRef.set(user);
      }
    });
  }

  logout() {
    this.fbAuth.auth.signOut();
    this.isSideNavOpen = false;
    this.router.navigate(['/login']);
  }

}
