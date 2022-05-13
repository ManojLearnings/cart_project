import { Component, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html"
})

export class HeaderComponent implements OnInit, OnDestroy{
  collapsed = true;
  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(private dataStorageService: DataStorageService,
    private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.userSubject.subscribe( user => {
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  onDataSave() {
    this.dataStorageService.storeRecipes();
  }

  onDataFetch() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.signOut();
  }
}