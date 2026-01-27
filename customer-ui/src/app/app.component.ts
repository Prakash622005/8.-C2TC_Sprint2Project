import { Component } from '@angular/core';
import { CustomerComponent } from './components/customer/customer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CustomerComponent],   // 👈 REQUIRED
  template: '<app-customer></app-customer>'
})
export class AppComponent {}
