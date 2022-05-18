import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, Observable, take, map } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromAppReduces from "../store/app.reducer"

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService,
    private store: Store<fromAppReduces.AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select("auth").pipe(
      take(1),
      map( authState => {
        return authState.user;
      }),
      exhaustMap( user => {
        if (!user) {
          return next.handle(req);
        }
        let modifiedRequest = req.clone({
          params: req.params.append('auth', user.token)
        }); 
        return next.handle(modifiedRequest);
      })
    )
  }
}