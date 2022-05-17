import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import { Store } from '@ngrx/store'
import * as ShoppingListActions from "../shopping-list/shopping-list.actions";

@Injectable()
export class RecipeService{
  recipeSelected =  new Subject<Recipe>();
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];

  constructor(
    private store: Store<{shoppingList: {ingrediants: Ingredient[]}}>
  ){}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;

    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  addIngrediantsToShoppingList(ingrediants: Ingredient[]){
    // this.slService.addIngrediants(ingrediants);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingrediants));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }
}