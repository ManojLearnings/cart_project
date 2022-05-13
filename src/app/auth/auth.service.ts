import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { AuthResponseData } from "./auth-response.model";
import { UserModel } from "./user.model";



@Injectable({providedIn: 'root'})
export class AuthService {
  userSubject = new BehaviorSubject<UserModel>(null);
  token: string = null;
  tokenExpirationTime: any;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(email: string, password: string) {
    const signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDUWAYDljIZTLqiUjuXgS9qGbNB1AUiDqc'
    return this.http.post<AuthResponseData>(signUpUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.errorHandler))
  }

  signIn(email: string, password: string){
    let signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDUWAYDljIZTLqiUjuXgS9qGbNB1AUiDqc'
    return this.http.post<AuthResponseData>(signInUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(catchError(this.errorHandler), tap(
      responseData => {
        this.handleAuthentication(responseData)
      }
    ))
  }

  signOut() {
    this.userSubject.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);

    if(this.tokenExpirationTime) {
      clearTimeout(this.tokenExpirationTime);
      this.tokenExpirationTime = null;
    }
  }

  autoSignIn() {
    let userData: {email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
    if(!userData) {
      return;
    }

    const loadedUser = new UserModel(userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      this.userSubject.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoSignout(expirationDuration);
    }
  }

  autoSignout(autoLogoutTime: number) {
    this.tokenExpirationTime = setTimeout(() => {
      this.signOut();
    }, autoLogoutTime);
  }

  private handleAuthentication(responseData: AuthResponseData){
    const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
    const user = new UserModel(responseData.email,
      responseData.localId,
      responseData.idToken,
      expirationDate)
    this.userSubject.next(user);
    const expirationTime = (expirationDate.getTime() - new Date().getTime());
    this.autoSignout(expirationTime);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private errorHandler(errorResponse: HttpErrorResponse) {
    let errorMessage = 'Unknown error occured.'
      if(!errorResponse.error || !errorResponse.error.error) {
        return throwError(errorMessage);
      }
      switch(errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'The password is invalid or the user does not have a password.';
          break;
        case 'USER_DISABLED':
          errorMessage = 'The user account has been disabled by an administrator.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'Password sign-in is disabled for this project.';
          break;
        case 'TOO_MANY_ATTEMPTS_TRY_LATER':
          errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
          break;
      }
      return throwError(errorMessage);
  }
}