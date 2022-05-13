import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { RecipeDetailsComponent } from "./recipe-details/recipe-details.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { RecipeItemComponent } from "./recipe-list/recipe-item/recipe-item.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeRoutingModule } from "./recipe-routes";
import { RecipeStartComponent } from "./recipe-start/recipe-start.component";
import { RecipesComponent } from "./recipes.component";

@NgModule({
  declarations: [ RecipesComponent,
    RecipeListComponent,
    RecipeDetailsComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent],
  imports: [RouterModule,
    CommonModule,
    ReactiveFormsModule,
    RecipeRoutingModule,
    SharedModule]
})
export class RecipesModule {}