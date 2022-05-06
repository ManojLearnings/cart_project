import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipeSelected =  new Subject<Recipe>();
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
}