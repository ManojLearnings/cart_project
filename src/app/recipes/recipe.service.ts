import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipeSelected =  new Subject<Recipe>();
  recipeChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [
    new Recipe('Pizza1', 
      'Double cheez pizza',
      'https://image.shutterstock.com/image-photo/kiev-ukraine-031219-sign-dominos-600w-1347282647.jpg',
        [ new Ingredient('Meat', 1), new Ingredient('Frech Fries', 20)]),
    new Recipe('Pizza2', 'Double cheez pizza', 'https://image.shutterstock.com/image-photo/kiev-ukraine-031219-sign-dominos-600w-1347282647.jpg', [new Ingredient('Meat', 1), new Ingredient('Frech Fries', 20)])
  ]

  constructor(private slService: ShoppingListService){

  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  addIngrediantsToShoppingList(ingrediants: Ingredient[]){
    this.slService.addIngrediants(ingrediants);
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