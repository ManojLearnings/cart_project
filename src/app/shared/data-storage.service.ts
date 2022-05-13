import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { UserModel } from "../auth/user.model";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put('https://ngcartproject-default-rtdb.firebaseio.com/recipes.json',
      recipes).subscribe( responseData => {
        console.log(responseData);
      })
  }

  fetchRecipes() {
    return this.authService.userSubject.pipe(
      take(1), 
      exhaustMap( (user: UserModel) => {
        return this.httpClient.get<Recipe[]>('https://ngcartproject-default-rtdb.firebaseio.com/recipes.json')
      }),
      map((recipeData: Recipe[]) => {
        return recipeData.map(recipe => {
          return {...recipe, ingrediants: recipe.ingrediants ? recipe.ingrediants : []}
        })
      }),
      tap((recipeData: Recipe[]) => {
        return this.recipeService.setRecipes(recipeData);
      })
    )
    
  }
}