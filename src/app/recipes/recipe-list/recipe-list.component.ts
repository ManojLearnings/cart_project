import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Pizza', 'Double cheez pizza', 'https://image.shutterstock.com/image-photo/kiev-ukraine-031219-sign-dominos-600w-1347282647.jpg'),
    new Recipe('Pizza', 'Double cheez pizza', 'https://image.shutterstock.com/image-photo/kiev-ukraine-031219-sign-dominos-600w-1347282647.jpg')
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
