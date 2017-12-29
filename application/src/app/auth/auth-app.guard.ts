import { Injectable, Inject } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthAppGuard implements CanLoad {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ){}

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuth();
  }

  checkAuth(): Observable<boolean> {
      
        return Observable.create(observer => {

            this.afAuth.authState.subscribe(response =>{
                if (response) {
                    observer.complete(true);
                } else {
                    this.router.navigate(['/login']);
                    observer.complete(false);
                }
            });

        });
    }
}
