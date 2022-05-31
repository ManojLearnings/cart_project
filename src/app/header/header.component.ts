import { Component, OnInit, OnDestroy } from "@angular/core";
import { map, Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import { Store } from "@ngrx/store";
import * as fromAppReduces from "../store/app.reducer"
import * as fromAuthActions from "../auth/store/auth.actions";
import * as RecipeActions from '../recipes/store/recipe.actions'

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html"
})

export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromAppReduces.AppState>) {}

  ngOnInit() {
    this.userSubscription = this.store.select('auth').pipe(
      map( authState => {
        return authState.user;
      })
    ).subscribe( user => {
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onDataSave() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }

  onDataFetch() {
    // this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes())
  }

  onLogout() {
    this.store.dispatch(new fromAuthActions.Logout());  
  }
}