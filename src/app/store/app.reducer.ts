import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer'
import * as fromAuth from '../auth/store/auth.reducer'
import { ActionReducerMap } from '@ngrx/store'
import * as fromRecipeReducer from '../recipes/store/recipe.reducer'

export interface AppState {
  shoppingList: fromShoppingList.State,
  auth: fromAuth.State,
  recipes: fromRecipeReducer.State
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipeReducer.recipeReducer
}