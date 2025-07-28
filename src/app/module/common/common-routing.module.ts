import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { DemoBookingComponent } from './components/booking/demo-booking/demo-booking.component';
import { EnrollClassComponent } from './components/booking/enroll/enroll.component';
import { IntegratorMessangerComponent } from './components/integrator/components/integrator-messanger';
import { IntegratorComponent } from './components/integrator/integrator.component';
import { CommonComponent } from './pages/common.component';
import { PaymentComponent } from '../../_shared/components/payments/payments.component';

const routes: Routes = [{ path: '', component: CommonComponent ,
   children: [
      { path: '', component: HomeComponent },
      {path: 'announcement', component: AnnouncementsComponent },
   {path:'demo-booking',
      component:DemoBookingComponent
    },
    {
      path:'enroll-class',
      component:EnrollClassComponent
    },
    {
      path:'morse-integrator',
      component:IntegratorComponent,
      
    },
    {
      path:"message",
      component:IntegratorMessangerComponent
    },
    {
      path:"payment",
      component:PaymentComponent
    }
    ]
},
  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule {}
