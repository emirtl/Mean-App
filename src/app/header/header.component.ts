import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private getIsAuthListnerSub: Subscription | undefined;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.getisAuth();
    this.getIsAuthListnerSub = this.authService
      .getIsAuthListner()
      .subscribe((bool) => {
        this.isUserAuthenticated = bool;
      });
  }

  logOut() {
    this.authService.logOut();
  }
  ngOnDestroy(): void {
    this.getIsAuthListnerSub!.unsubscribe();
  }
}
