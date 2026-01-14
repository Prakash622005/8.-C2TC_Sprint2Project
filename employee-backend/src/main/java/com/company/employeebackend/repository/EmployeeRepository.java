package com.company.employeebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.company.employeebackend.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
