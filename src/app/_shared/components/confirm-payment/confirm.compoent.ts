import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import e from 'express';

@Component({
  selector: 'app-payment-status',
  standalone: true,
  templateUrl: './confirm.component.html',
  imports: [RouterModule, CommonModule],
})
export class PaymentStatusComponent implements OnInit {
  status: 'pending' | 'confirmed' | 'failed' = 'pending'; // dynamically set this if needed
  @Input() paymentMethod: any;
  isFileUploaded: boolean = false;
  ngOnInit(): void {
   
  }
}
