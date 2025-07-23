import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddSubscriptionComponent } from './component/add-subscription/add-subscription.component';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, AddSubscriptionComponent],
  templateUrl: './subscription.component.html',
})
export class SubscriptionComponent {
  public showAddSubscription: boolean = false;
  subscriptions = [
    {
      id: 1,
      title: '3 Months Subscription',
      message: 'Rs.399 (Indian Members) / $7 (International Members)',
      date: new Date(2025, 6, 1), // July 1, 2025,
      isActive: true,
    },
    {
      id: 2,
      title: '6 Months Subscription',
      message: 'Rs.699 (Indian Members) / $11 (International Members)',
      date: new Date(2025, 6, 1),
      isActive: true,
    },
    {
      id: 3,
      title: '1 Year Subscription',
      message: 'Rs.1000 (Indian Members) / $17 (International Members)',
      date: new Date(2025, 6, 1),
      isActive: true,
    },
  ];

  public addAnnouncement() {
    this.showAddSubscription = true;
  }

  activate(id: number) {
    this.subscriptions = this.subscriptions.map((sub) =>
      sub.id === id ? { ...sub, isActive: true } : sub
    );
  }

  deactivate(id: number) {
    this.subscriptions = this.subscriptions.map((sub) =>
      sub.id === id ? { ...sub, isActive: false } : sub
    );
  }

  deleteSubscription(id: number) {
    this.subscriptions = this.subscriptions.filter((sub) => sub.id !== id);
  }
}
