import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from '../user/user.model';
import { DomUtilitiesService } from '../shared/dom-utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any;
  isLoading: boolean;
  loginButtonLabel: string;
  resetButtonLabel: string;
  isResetting: boolean;
  message: string;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    private domUtilitiesService: DomUtilitiesService
  ) {
    this.user = {};
    this.isLoading = true;
    this.loginButtonLabel = "Login";
    this.isResetting = false;
    this.resetButtonLabel = "Reset password";
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(response =>{
      if (response) {
          this.router.navigate(['/transaction']);
      } else {
        this.domUtilitiesService.removeFullPageLoading();
      }
      this.isLoading = false;
  });
  }

  login() {
    this.isLoading = true;
    this.loginButtonLabel = "Loading...";
    this.afAuth.auth.signInWithEmailAndPassword(this.user.email, this.user.password).then(auth => {

      const uid = auth.user ? auth.user.uid : auth.uid;

      const userRef = this.db.object('users/' + uid);

      const userSubscription = userRef.valueChanges().subscribe((user: any) => {

        this.domUtilitiesService.addFullPageLoading();

        if (!user) {
          
          const user = new User(auth.user);

          userRef.set(user).then(() => {
            userSubscription.unsubscribe();
            this.router.navigate(['/transaction']);
          });

        } else {
          userSubscription.unsubscribe();
          this.router.navigate(['/transaction']);
        }
      });
      
    }, error => {
      this.message = "Error! Please check your email and password and try again."
      setTimeout(() => {
        this.loginButtonLabel = "Login";
        this.isLoading = false;
        this.message = null;
      }, 4000)
    });
  }

  setToReset() {
    this.isResetting = true;
  }

  sendPasswordResetEmail() {
    this.isLoading = true;
    this.resetButtonLabel = "Loading...";

    const actionCodeSettings = {
      url: window.location.protocol + "//" + window.location.host + "/login"
    }

    this.afAuth.auth.sendPasswordResetEmail(this.user.email, actionCodeSettings).then(() => {
      this.message = "Success! Check your email for instructions";
      setTimeout(() => {
        this.isResetting = false
        this.isLoading = false;
        this.message = null;
        this.resetButtonLabel = "Reset password";
      }, 4000)
    }, error => {
      
      this.message = "Error. Please check you email and try again";
      setTimeout(() => {
        this.isLoading = false;
        this.message = null;
        this.resetButtonLabel = "Reset password";
      }, 3000)
    })
  }

  cancelReset() {
    this.isResetting = false;
  }
}
