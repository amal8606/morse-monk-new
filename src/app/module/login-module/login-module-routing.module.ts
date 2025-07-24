import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModuleComponent } from './pages/login-module.component';
import { PaymentComponent } from '../../_shared/components/payments/payments.component';
import { LoginComponent } from './components/login/login.component';
import { OtpVerificationComponent } from './components/otpVerification/otpverification.compont';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [{
  path:"",component:LoginModuleComponent,
  children:[
    {path: '', component: LoginComponent },
   {path:'payment',component:PaymentComponent},
   {path:'register',component:RegisterComponent},
   {path:'reset',component:OtpVerificationComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginModuleRoutingModule { }
