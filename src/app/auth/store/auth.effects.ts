import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth-response.model";
import { AuthService } from "../auth.service";
import { UserModel } from "../user.model";
import * as fromAuthActions from "./auth.actions"

const signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseApiKey;
const signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.fireBaseApiKey;

const handleAuthentication = (responseData) => {
  const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
  const user = new UserModel(responseData.email,
    responseData.localId,
    responseData.idToken,
    expirationDate)
  localStorage.setItem('userData', JSON.stringify(user));
  return new fromAuthActions.AuthenticateSuccess({
    email: responseData.email,
    userId: responseData.localId,
    token: responseData.idToken,
    expirationDate: expirationDate
  });
}

const handleError = (errorResponse) => {
  let errorMessage = 'Unknown error occured.'
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
  return of(new fromAuthActions.AuthenticateFailed(errorMessage));
}

@Injectable()
export class AuthEffects {
  
  @Effect()
  authSignUp = this.action$.pipe(
    ofType(fromAuthActions.SIGNUP_START),
    switchMap((authData: fromAuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(signUpUrl, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap( responseData => {
          this.authService.setLogoutTimer( +responseData.expiresIn * 1000);
        }),
        map( responseData => {
          return handleAuthentication(responseData);
        }),
        catchError( error => {
          return handleError(error);
        })
      )
    })
  )

  @Effect()
  authSignIn = this.action$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((authData: fromAuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(signInUrl, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap( responseData => {
          this.authService.setLogoutTimer( +responseData.expiresIn * 1000);
        }),
        map( responseData => {
          return handleAuthentication(responseData);
        }),
        catchError( error => {
          return handleError(error);
        })
      )
    })
  )

  @Effect({ dispatch: false })
  authSignout = this.action$.pipe(
    ofType(fromAuthActions.LOGOUT),
    tap( () => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  )

  @Effect()
  autoLogin = this.action$.pipe(
    ofType(fromAuthActions.AUTO_LOGIN),
    map( () => {
      let userData: {email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string} = JSON.parse(localStorage.getItem('userData'));
      if(!userData) {
        return { type: 'DUMMY' };
      }
  
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        
      const loadedUser = new UserModel(userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate));
  
      if (loadedUser.token) {
        this.authService.setLogoutTimer(expirationDuration);
        return new fromAuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        });
      }

      return { type: 'DUMMY' };
  
    })
  )

  @Effect({ dispatch: false })
  authRedirect = this.action$.pipe(
    ofType(fromAuthActions.AUTHENTICATE_SUCCESS),
    tap( () => {
      this.router.navigate(['/'])
    })
  );

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}