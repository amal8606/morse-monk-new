import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { HeaderComponent } from './pages/header/header.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, AdminRoutingModule, HeaderComponent],
})
export class AdminModule {}
