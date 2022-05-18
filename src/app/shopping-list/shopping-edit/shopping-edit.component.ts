import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as shoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slsForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slsForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
      else {
        this.editMode = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new shoppingListActions.StopEdit());
  }

  onClear() {
    this.editMode = false;
    this.slsForm.reset();
    this.store.dispatch(new shoppingListActions.StopEdit());
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngrediant = new Ingredient(value.name, value.amount);
    if(this.editMode){
      // this.slService.updateIngrediants(this.editItemIndex, newIngrediant);
      this.store.dispatch(new shoppingListActions.UpdateIngredient(newIngrediant));
    }
    else {
      // this.slService.addIngredient(newIngrediant);
      this.store.dispatch(new shoppingListActions.AddIngredient(newIngrediant));
    }
    this.onClear();
  }

  onDelete(){
    // this.slService.deleteIngrediant(this.editItemIndex)
    this.store.dispatch(new shoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
