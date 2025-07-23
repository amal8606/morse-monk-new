import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { NavigationEnd, RouterOutlet,Router } from '@angular/router';
  import { Inject, PLATFORM_ID } from '@angular/core';
  import { isPlatformBrowser } from '@angular/common';
  import * as AOS from 'aos';
import { HeaderComponent } from './module/admin/pages/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'morseMonk';
  isNavBarVisible = true;
  hideLayout = false;
  private lastScrollTop = 0;
  constructor(private readonly router: Router,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
   router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
       this.hideLayout = event.urlAfterRedirects.startsWith('/admin');
    }
    
  });
  }
ngAfterViewInit() {
  if (isPlatformBrowser(this.platformId)) {
    import('aos').then((AOS) => {
      AOS.default.init({
        duration: 1000,
        once: true,
      });

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            AOS.default.refresh();
          }, 100);
        }
      });
    });
  }
}
  @HostListener('window:scroll', [])
  onWindowscroll() {
    const currectScroll =
      window.pageYOffset || document.documentElement.scrollTop;
    if (currectScroll > this.lastScrollTop) {
      // Scrolling down
      this.isNavBarVisible = false;
    } else {
      // Scrolling up
      this.isNavBarVisible = true;
    }
    this.lastScrollTop = currectScroll;
  }

public scrollToSections(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    const yOffset = -120; // Negative offset to adjust for fixed navbar height
    const y = el.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

}
