import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model'
import { Store } from '@ngrx/store'
import * as fromShoppingListActions from './shopping-list.actions'
import * as fromShoppingList from './shopping-list.reducer'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<fromShoppingList.AppState>;
  constructor(private store: Store<any>
  ) { }
  ingredientsChangedSubscription: Subscription;

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.ingredientsChangedSubscription = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // )
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSubscription.unsubscribe();
  }

  onEditItem(index: number) {
    // this.slService.startEditing.next(index);
    this.store.dispatch(new fromShoppingListActions.StartEdit(index));
  }
}
