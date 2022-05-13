import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PlaceholderDirective } from "../placeholder/placeholder.directive";
import { AlertComponent } from "./alert/alert.component";
import { Dropdown } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner.component";

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    Dropdown
  ],
  imports: [],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    Dropdown,
    CommonModule
  ]
})

export class SharedModule {}