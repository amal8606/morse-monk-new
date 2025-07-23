import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-add-subscription',
  standalone: true,
  imports: [],
  templateUrl: './add-subscription.component.html',
})
export class AddSubscriptionComponent {
  public showAddAnnouncement = false;
  public newTagName = '';
  public customers = [
    { id: 1, name: 'Acme Corp' },
    { id: 2, name: 'Globex Inc' },
    { id: 3, name: 'Soylent LLC' },
    { id: 4, name: 'Initech' },
    { id: 5, name: 'Umbrella Corp' },
  ];

  @Output() onClick = new EventEmitter();

  constructor() {}

  public closeModel() {
    this.onClick.emit();
  }

  onSubmit() {}
}
