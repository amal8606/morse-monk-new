import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutComponent } from '../about/about.component';
import { ContactComponent } from '../contact/contact.component';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../../../../_core/services/seo.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, ContactComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  [x: string]: any;
  constructor(
    private readonly route: Router,
    private router: ActivatedRoute,
    private readonly seoService: SeoService
  ) {}
  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Morse Monk - Learn Morse Code',
      description:
        'Morse Monk is a platform that helps you learn Morse Code in a fun and interactive way. Whether you are a beginner or an advanced learner, Morse Monk has got you covered.',
      keywords:
        'Morse, Online, Interactive, Classes, Lesson, MMD signal exam, Ham radio exam, Morse visual signal, Reception, Tool for sending morse message',
    });
  }
  ngAfterViewInit() {
    this.router.fragment.subscribe((fragment) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          // smooth scroll
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 0);
        }
      }
    });
  }

  public userNotLoggedIn: any = true;
  public navigateTo(path: string) {
    if (path === 'checkLogin') {
      if (!this.userNotLoggedIn) {
        this.route.navigate(['/login']);
      } else {
        this.route.navigate(['/enroll-class']);
      }
    } else {
      this.route.navigate([path]);
    }
  }

  public scrollToRegisterForm() {
    document
      .getElementById('registerForm')
      ?.scrollIntoView({ behavior: 'smooth' });
  }
}
