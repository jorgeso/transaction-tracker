import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { User } from '../user/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(response =>{
      if (response) {
          this.router.navigate(['/transaction']);
      };
  });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(auth => {

      const userRef = this.db.object('users/' + auth.user.uid);

      const userSubscription = userRef.valueChanges().subscribe((user: any) => {

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
      
    });
  }

  
}
