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
  private storeSub: Subscription;

  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;

  constructor(private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromAppReducer.AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe( authState => {
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

    if(this.storeSub){
      this.storeSub.unsubscribe();
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
    if (this.isLoginMode) {
      this.store.dispatch(new fromAuthActions.LoginStart(
        {
          email: form.value.email,
          password: form.value.password
        }
      ))
    }
    else {
      this.store.dispatch(new fromAuthActions.SignupStart(
        {
          email: form.value.email,
          password: form.value.password
        }
      ))
    }

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new fromAuthActions.ClearError())
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