import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slsForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;
  constructor(private slService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.slService.startEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.slsForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onClear() {
    this.editMode = false;
    this.slsForm.reset();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngrediant = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.slService.updateIngrediants(this.editItemIndex, newIngrediant);
    }
    else {
      this.slService.addIngredient(newIngrediant);
    }
    this.onClear();
  }

  

  onDelete(){
    this.slService.deleteIngrediant(this.editItemIndex)
    this.onClear();
  }
}
