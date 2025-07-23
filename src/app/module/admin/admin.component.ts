import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './pages/header/header.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, CommonModule,HeaderComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent {}
