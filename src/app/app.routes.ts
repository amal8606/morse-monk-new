import { Routes } from '@angular/router';
import { PaymentComponent } from './_shared/components/payments/payments.component';
import { LoginComponent } from './module/login/login.component';
import { RegisterComponent } from './module/register/register.component';
import { OtpVerificationComponent } from './module/otpVerification/otpverification.compont';

export const routes: Routes = [
  { path: '', 
    loadChildren: ()=>import('./module/common/common-routing.module').then(m => m.CommonRoutingModule) },
   
    {path:'admin',
      loadChildren:()=>import('./module/admin/admin-routing.module').then(m=>m.AdminRoutingModule)
    },
  // {path: 'about', component: AboutComponent },
  // {path: 'contact', component: ContactComponent },
   {path: 'login', component: LoginComponent },
   {path:'payment',component:PaymentComponent},
   {path:'register',component:RegisterComponent},
   {path:'reset',component:OtpVerificationComponent}

];
