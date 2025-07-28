import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../../_core/http/api/user.service';
import { UserLoginService } from '../../../../_core/services/userLogin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public showMenu: boolean = false;
  constructor(
    private readonly userService: UserService,
    private readonly userLoginService: UserLoginService,
    private readonly route: Router
  ) {}
  userInfo: any;
  ngOnInit() {
    this.userLoginService.userInfo$.subscribe((user) => {
      this.userInfo = user;
    });
  }
  public logOut() {
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