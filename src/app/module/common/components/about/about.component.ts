import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(public route:Router) {}
  public scrollToRegisterForm() {
    document.getElementById('registerForm')?.scrollIntoView({ behavior: 'smooth' });
  }
     public navigateTo(path: string) {
    this.route.navigate([path]);
  }
}
