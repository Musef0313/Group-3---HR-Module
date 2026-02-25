

package com.hrms.controller;

import com.hrms.entity.Employee;
import com.hrms.service.EmployeeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
//It si only access to react port "3000"
@CrossOrigin(origins = "http://localhost:3000")

//the Line  give Access to all port 
//@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService service;

    public EmployeeController(EmployeeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees() {
        List<Employee> employees = service.getAllEmployees();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", employees);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeeById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return service.getEmployeeById(id)
                .map(emp -> {
                    response.put("success", true);
                    response.put("data", emp);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Employee not found");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEmployee(@RequestBody Employee emp) {
        Map<String, Object> response = new HashMap<>();
        try {
            Employee saved = service.createEmployee(emp);
            response.put("success", true);
            response.put("message", "Employee created successfully");
            response.put("data", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error creating employee: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEmployee(@PathVariable Long id, @RequestBody Employee empDetails) {
        Map<String, Object> response = new HashMap<>();
        try {
            Employee updated = service.updateEmployee(id, empDetails);
            response.put("success", true);
            response.put("message", "Employee updated successfully");
            response.put("data", updated);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", "Employee not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            service.deleteEmployee(id);
            response.put("success", true);
            response.put("message", "Employee deleted successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", "Employee not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
