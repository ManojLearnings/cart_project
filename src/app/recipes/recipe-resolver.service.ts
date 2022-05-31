import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, of, switchMap, take } from "rxjs";
import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer"
import * as RecipeActions from "../recipes/store/recipe.actions"
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn: 'root'})
export class RecipeResolver implements Resolve<Recipe[]>{
  constructor(
    private store: Store<fromApp.AppState>,
    private actions: Actions  
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap( recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipeActions.FetchRecipes());
          return this.actions.pipe(
            ofType(RecipeActions.SET_RECIPES), take(1)
          )
        }
        else {
          return of(recipes);
        }
      })
    )
    
    // const recipes = this.recipeService.getRecipes();
    // if(recipes.length > 0){
    //   return recipes;
    // }
    // else {
    //   return this.dataStorageService.fetchRecipes();
    // }
  }
}