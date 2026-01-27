import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./customer.component.html",
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerForm!: FormGroup;
  customers: Customer[] = [];
  isEdit = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe(data => {
      this.customers = data;
    });
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) return;

    const payload = this.customerForm.value;

    if (this.isEdit && this.editingId !== null) {
      this.customerService.update(this.editingId, payload).subscribe(updated => {
        this.customers = this.customers.map(c =>
          c.customerId === updated.customerId ? updated : c
        );
        this.resetForm();
      });
    } else {
      this.customerService.create(payload).subscribe(saved => {
        this.customers = [...this.customers, saved];
        this.resetForm();
      });
    }
  }

  editCustomer(c: Customer): void {
    this.customerForm.patchValue({
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address
    });
    this.editingId = c.customerId!;
    this.isEdit = true;
  }

  deleteCustomer(id: number): void {
  this.customerService.delete(id).subscribe(() => {
    this.customers = this.customers.filter(c => c.customerId !== id);
  });
}


  resetForm(): void {
    this.customerForm.reset();
    this.isEdit = false;
    this.editingId = null;
  }
  trackById(index: number, c: any): number {
  return c.customerId;
}

}
