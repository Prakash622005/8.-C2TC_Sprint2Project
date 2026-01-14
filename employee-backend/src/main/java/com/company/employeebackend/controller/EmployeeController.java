package com.company.employeebackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.company.employeebackend.model.Employee;
import com.company.employeebackend.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:4200")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    // ✅ GET ALL EMPLOYEES
    @GetMapping
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();   // 🔥 FIX HERE
    }

    // ✅ ADD EMPLOYEE
    @PostMapping
    public Employee save(@RequestBody Employee employee) {
        return service.save(employee);
    }

    // ✅ UPDATE EMPLOYEE
    @PutMapping("/{id}")
    public Employee update(
            @PathVariable Long id,
            @RequestBody Employee employee) {
        return service.update(id, employee);
    }

    // ✅ DELETE EMPLOYEE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
