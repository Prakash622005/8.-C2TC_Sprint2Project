import { Component, OnInit, ChangeDetectorRef,NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  isSubmitting = false;
  isEditMode = false;
  editEmployeeId?: number;

  employee: Employee = {
    name: '',
    position: '',
    salary: undefined
  };

  employees: Employee[] = [];
  searchTerm: string = '';
  private alertedForSearch: boolean = false;

  get filteredEmployees(): Employee[] {
    if (!this.searchTerm) {
      this.alertedForSearch = false;
      return this.employees;
    }
    const filtered = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (emp.id && emp.id.toString().includes(this.searchTerm))
    );
    if (filtered.length === 0 && this.searchTerm.trim() !== '' && !this.alertedForSearch) {
      this.alertedForSearch = true;
      alert('No employee found with this name or ID');
    } else if (filtered.length > 0) {
      this.alertedForSearch = false;
    }
    return filtered;
  }

  constructor(
  private employeeService: EmployeeService,
  private cdr: ChangeDetectorRef,
  private zone: NgZone
) {}


  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error(err)
    });
  }

  editEmployee(emp: Employee): void {
    this.employee = { ...emp };   // copy row to form
    this.isEditMode = true;
    this.editEmployeeId = emp.id;
  }

  submitEmployee(): void {

  if (this.isSubmitting) return;

  this.isSubmitting = true;

  if (this.isEditMode && this.editEmployeeId) {
    this.employeeService.updateEmployee(this.editEmployeeId, this.employee)
  .subscribe({
    next: updated => {
      this.zone.run(() => {
        this.employees = this.employees.map(emp =>
          emp.id === updated.id ? { ...updated } : emp
        );

        this.resetForm();
        this.isSubmitting = false;

        this.cdr.detectChanges(); // 🔥 force UI refresh
      });
    },
    error: err => {
      console.error(err);
      this.isSubmitting = false;
    }
  });

  } else {
    this.employeeService.addEmployee(this.employee).subscribe({
  next: saved => {
    this.zone.run(() => {
      this.employees = [...this.employees, saved];
      this.resetForm();
      this.isSubmitting = false;
      this.cdr.detectChanges();
    });
  },
  error: err => {
    console.error(err);
    this.isSubmitting = false;
  }
});

  }
}

  resetForm(): void {
    this.employee = {
      name: '',
      position: '',
      salary: 0
    };
    this.isEditMode = false;
    this.editEmployeeId = undefined;
  }

  deleteEmployee(id?: number): void {
    if (!id) return;

    // optimistic UI update
    this.employees = this.employees.filter(emp => emp.id !== id);
    this.cdr.detectChanges();

    this.employeeService.deleteEmployee(id).subscribe({
      error: err => {
        console.error(err);
        this.loadEmployees(); // rollback if delete fails
      }
    });
  }
}
