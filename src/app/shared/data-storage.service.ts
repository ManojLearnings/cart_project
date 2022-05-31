import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs";
import { UserModel } from "../auth/user.model";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { Store } from "@ngrx/store";
import * as fromAppReduces from "../store/app.reducer"
import * as fromAppActions from "../recipes/store/recipe.actions"

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService,
    private store: Store<fromAppReduces.AppState>) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put('https://ngcartproject-default-rtdb.firebaseio.com/recipes.json',
      recipes).subscribe( responseData => {
        console.log(responseData);
      })
  }

  fetchRecipes() {
    return this.store.select('auth').pipe(
      take(1),
      map( authState => {
        return authState.user;
      }),
      exhaustMap( (user: UserModel) => {
        return this.httpClient.get<Recipe[]>('https://ngcartproject-default-rtdb.firebaseio.com/recipes.json')
      }),
      map((recipeData: Recipe[]) => {
        return recipeData.map(recipe => {
          return {...recipe, ingrediants: recipe.ingrediants ? recipe.ingrediants : []}
        })
      }),
      tap((recipeData: Recipe[]) => {
        // return this.recipeService.setRecipes(recipeData);
        this.store.dispatch(new fromAppActions.SetRecipes(recipeData));
      })
    )
    
  }
}