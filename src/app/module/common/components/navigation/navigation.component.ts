import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../_core/http/api/user.service';
import { UserLoginService } from '../../../../_core/services/userLogin.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  @Output() sectionId = new EventEmitter<string>();
  public userInfo: any = {};
  public isMobileMenuOpen = false;

  constructor(
    private readonly route: Router,
    private readonly userLoginService: UserLoginService,
    private readonly userService: UserService
  ) {}
  ngOnInit() {
    this.sub = this.userLoginService.userInfo$.subscribe((user) => {
      this.userInfo = user;
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  public navigateTo(path: string) {
    this.route.navigate([path]);
  }

  public scrollToSection(id: string) {
    this.route.navigate(['/'], { fragment: id });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logOut() {
    this.userService.logout(this.userInfo.userId).subscribe({
      next: () => {
        this.route.navigate(['/']);
      },
      error: () => {},
      complete: () => {
        this.userLoginService.clearUserInfo();
      },
    });
  }
}
