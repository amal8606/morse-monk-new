import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor(private readonly route: Router) {}

  public navigateTo(path: string) {
    this.route.navigate([path]);
  }

  public scrollToSection(id: string) {
    this.route.navigate(['/'], { fragment: id });
  }
}
