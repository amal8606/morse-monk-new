import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './pages/home/home.component';
import { MmdCenterComponent } from './pages/mmd-center/mmd-center.component';
import { UserComponent } from './pages/user/user.component';
import { AnnouncementsComponent } from './pages/announcement/announcements.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { SubscripedUserComponent } from './pages/subscriped-user/subscriped-user.component';
import { EnquiryComponent } from './pages/enquiry/enquiry.component';
import { AdminComponent } from './admin.component';
import { authGuard } from '../../_core/guard/auth.guard';
const routes: Routes = [
  { path: '', component: AdminComponent ,canActivate:[authGuard],
    children: [
      {path: '', component: AdminHomeComponent },
      { path: 'users', component: UserComponent },
  { path: 'announcements', component: AnnouncementsComponent },
  { path: 'mmd-center', component: MmdCenterComponent },
  { path: 'subscription', component: SubscriptionComponent },
  { path: 'subscribed-user', component: SubscripedUserComponent },
  { path: 'enquiry', component: EnquiryComponent }]
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
