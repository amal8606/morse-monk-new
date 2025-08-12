import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
  inject,
  HostListener,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
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
 activePath: string = '';
  sectionIds = ['home', 'about', 'contact'];
  activeFragment: string = '';
  @Output() sectionId = new EventEmitter<string>();
  public userInfo: any = {};
  public isMobileMenuOpen = false;

  constructor(
    private readonly route: Router,
    private readonly userLoginService: UserLoginService,
    private readonly userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {}
   @HostListener('window:scroll', [])
  onScroll() {
      if (this.activePath !== '/' && this.activePath !== '') {
    return;
  }
    let currentSection = '';

    for (const sectionId of this.sectionIds) {
      const sectionEl = document.getElementById(sectionId);
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        const offset = 150; // How early to highlight before top hits
        if (rect.top <= offset && rect.bottom > offset) {
          currentSection = sectionId;
          break;
        }
      }
    }

    if (currentSection && currentSection !== this.activeFragment) {
      this.activeFragment = currentSection;
    }
  }
  ngOnInit() {
      this.activePath = this.route.url.split('#')[0];
  this.activeFragment = this.activatedRoute.snapshot.fragment || '';
    this.sub = this.userLoginService.userInfo$.subscribe((user) => {
      this.userInfo = user;
       this.route.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.activePath = this.route.url.split('#')[0]; // Path without fragment
        this.activeFragment = this.activatedRoute.snapshot.fragment || '';
      });
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
  public isActivePage(path: string) {
    return this.activePath === path;
  }

  public isActiveFragment(fragment: string) {
    return this.activeFragment === fragment;
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
