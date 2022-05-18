import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { PlaceholderDirective } from "../placeholder/placeholder.directive";
import { AlertComponent } from "../shared/alert/alert.component";
import { AuthResponseData } from "./auth-response.model";
import { AuthService } from "./auth.service";
import * as fromAppReducer from "./../store/app.reducer"
import * as fromAuthActions from "./store/auth.actions"
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error = null;
  private closeSub: Subscription;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromAppReducer.AppState>) {}

  ngOnInit(): void {
    this.store.select('auth').subscribe( authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if(this.error) {
        this.showErrorMessage(this.error);
      }
    })
  }

  ngOnDestroy(): void {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    this.isLoading = true;

    let authObservable;

    if (this.isLoginMode) {
      this.store.dispatch(new fromAuthActions.LoginStart(
        {
          email: form.value.email,
          password: form.value.password
        }
      ))
      // authObservable = this.authService.signIn(form.value.email, form.value.password)
    }
    else {
      authObservable = this.authService.signUp(form.value.email, form.value.password)
    }

    // authObservable.subscribe(
    //   responseData => {
    //     console.log(responseData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes'])
    //   },
    //   errorMessage => {
    //     this.error = errorMessage;
    //     this.showErrorMessage(errorMessage);
    //     this.isLoading = false;
    //   }
    // )

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorMessage(errorMessage: string) {
    let alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    let hostViewContainer = this.alertHost.viewContainerRef;
    hostViewContainer.clear();
    const componentRef = hostViewContainer.createComponent(alertComponentFactory);
    componentRef.instance.message = errorMessage;
    this.closeSub = componentRef.instance.close.subscribe( () => {
      this.closeSub.unsubscribe();
      hostViewContainer.clear();
    });
  }
}