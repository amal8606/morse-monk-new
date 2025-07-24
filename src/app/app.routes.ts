import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', 
    loadChildren: ()=>import('./module/common/common-routing.module').then(m => m.CommonRoutingModule) },
   
    {path:'admin',
      loadChildren:()=>import('./module/admin/admin-routing.module').then(m=>m.AdminRoutingModule)
    },
     {path:'login',
      loadChildren:()=>import('./module/login-module/login-module-routing.module').then(m=>m.LoginModuleRoutingModule)
    },
  // {path: 'about', component: AboutComponent },
  // {path: 'contact', component: ContactComponent },
   

];
