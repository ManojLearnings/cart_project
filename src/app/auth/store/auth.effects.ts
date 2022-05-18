import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth-response.model";
import * as fromAuthActions from "./auth.actions"

@Injectable()
export class AuthEffects {
  signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.fireBaseApiKey;
  
  @Effect()
  authLogin = this.action$.pipe(
    ofType(fromAuthActions.LOGIN_START),
    switchMap((authData: fromAuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(this.signInUrl, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        map( responseData => {
          const expirationDate = new Date(new Date().getTime() + +responseData.expiresIn * 1000);
          return new fromAuthActions.Login({
            email: responseData.email,
            userId: responseData.localId,
            token: responseData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError( error => {
          return of(new fromAuthActions.LoginFailed(error.message));
        })
      )
    })
  )

  @Effect({ dispatch: false })
  authSuccess = this.action$.pipe(ofType(fromAuthActions.LOGIN),
    tap( () => {
      this.router.navigate(['/'])
    })
  );

  constructor(
    private action$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}