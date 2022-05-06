import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService{
  ingredientsChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [new Ingredient('salt', 2),
      new Ingredient('wheat', 20)];
  startEditing = new Subject<number>();
  

  getIngredients(){
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient(ingredient) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients);
  }

  addIngrediants(ingrediants: Ingredient[]){
    this.ingredients.push(...ingrediants);
    this.ingredientsChanged.next(this.ingredients);
  }

  updateIngrediants(index: number, newIngrediant: Ingredient){
    this.ingredients[index] = newIngrediant;
    this.ingredientsChanged.next(this.ingredients);
  }

  deleteIngrediant(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients);
  }
}
