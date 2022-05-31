import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from "../recipe.model";
import * as RecipeActions from "./recipe.actions"
import * as fromAppReducer from "../../store/app.reducer"

@Injectable()
export class RecipeEffects {
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipeActions.FETCH_RECIPES),
    switchMap( () => {
        return this.httpClient.get<Recipe[]>('https://ngcartproject-default-rtdb.firebaseio.com/recipes.json')
      }),
      map((recipeData: Recipe[]) => {
        return recipeData.map(recipe => {
          return {...recipe, ingrediants: recipe.ingrediants ? recipe.ingrediants : []}
        })
      }),
      map((recipes: Recipe[]) => {
        return new RecipeActions.SetRecipes(recipes);
      }),
   )

   @Effect({ dispatch: false })
   storeRecipe = this.actions$.pipe(
     ofType(RecipeActions.STORE_RECIPES),
     withLatestFrom(this.store.select('recipes')),
     switchMap( ( [actionData, recipesState] ) => {
      return this.httpClient.put(
        'https://ngcartproject-default-rtdb.firebaseio.com/recipes.json',
        recipesState.recipes)
    })
   )
  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private store: Store<fromAppReducer.AppState>
  ) {}
}