import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import { Recipe } from '../recipe.model';
import * as fromRecipeActions from '../store/recipe.actions'
import * as fromShoppingListActions from '../../shopping-list/store/shopping-list.actions'


@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  @Input() recipe: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    const id = this.route.params.pipe(map((params)  => {
      return +params['id']
    }),
      switchMap( id => {
        this.id = id;
        return this.store.select('recipes')
      }),
      map(recipesState => {
        return recipesState.recipes[this.id];
      })
    ).subscribe(
      (recipe) => {
        this.recipe = recipe;
      }
    )
    
  }

  onAddToShoopingList() {
    this.store.dispatch(new fromShoppingListActions.AddIngredients(this.recipe.ingrediants))
  }

  onDeleteRecipe() {
    this.store.dispatch(new fromRecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}
