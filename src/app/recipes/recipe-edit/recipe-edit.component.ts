import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import * as fromRecipeActions from '../store/recipe.actions'

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode: boolean = false;
  recipeForm: FormGroup;
  recipeIngrediants: FormArray;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = (this.id !== null && !isNaN(this.id));
        this.initForm();
      }
    )
  }

  ngOnDestroy(): void {
    if(this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSubmit() {
    if(this.editMode){
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(new fromRecipeActions.UpdateRecipe({
        index: this.id,
        newRecipe: this.recipeForm.value
      }));
    }
    else{
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new fromRecipeActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();
  }

  private initForm() {
    let recipeName = ''
    let recipeDescription = ''
    let imagePath = ''
    let recipeIngrediants = new FormArray([]);

    if(this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes').pipe(map( recipesState => {
        return recipesState.recipes[this.id];
      })).subscribe( recipe => {
        recipeName = recipe.name;
        recipeDescription = recipe.description;
        imagePath = recipe.imagePath;
        
        if(recipe['ingrediants']){
          for(let ingrediant of recipe.ingrediants) {
            recipeIngrediants.push(
              new FormGroup({
                name: new FormControl(ingrediant.name, Validators.required), 
                amount: new FormControl(ingrediant.amount, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]) 
              })
            )
          }
        }
      })
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(imagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingrediants: recipeIngrediants
    })
  }

  getRecipeControls() {
    return (<FormArray>this.recipeForm.get('ingrediants')).controls;
  }

  addIngrediant() {
    (<FormArray>this.recipeForm.get('ingrediants')).push(
      new FormGroup({
        name: new FormControl('', Validators.required),
        amount: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }

  deleteIngrediant(index: number) {
    (<FormArray>this.recipeForm.get('ingrediants')).removeAt(index);
  }
}
