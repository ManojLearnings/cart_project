import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.params.subscribe(
      (params) => {
        this.id = +params['id']
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
    
  }

  onAddToShoopingList() {
    this.recipeService.addIngrediantsToShoppingList(this.recipe.ingrediants);
  }

}
