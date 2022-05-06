import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public ingrediants: Ingredient[];

  constructor(name: string, description: string, imagePath: string, ingrediants: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingrediants = ingrediants;
  }
}