import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromAuthActions from './store/auth.actions'

@Injectable({providedIn: 'root'})
export class AuthService {
  // userSubject = new BehaviorSubject<UserModel>(null);
  token: string = null;
  tokenExpirationTime: any;

  constructor(private store: Store) {}

  setLogoutTimer(autoLogoutTime: number) {
    this.tokenExpirationTime = setTimeout(() => {
      this.store.dispatch(new fromAuthActions.Logout());
    }, autoLogoutTime);
  }

  clearLogoutTimer() {
    if(this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
      this.tokenExpirationTime = null;
    }
  }
}