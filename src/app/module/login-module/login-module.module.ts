import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginModuleRoutingModule } from './login-module-routing.module';
import { LoginModuleComponent } from './pages/login-module.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LoginModuleRoutingModule
  ]
})
export class LoginModuleModule { }
