package com.hrms.service;

import com.hrms.entity.Employee;
import com.hrms.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> getAllEmployees() {
        return repository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return repository.findById(id);
    }

    public Employee createEmployee(Employee emp) {
        return repository.save(emp);
    }

    public Employee updateEmployee(Long id, Employee empDetails) {
        return repository.findById(id).map(emp -> {
            emp.setEmpCode(empDetails.getEmpCode());
            emp.setName(empDetails.getName());
            emp.setEmail(empDetails.getEmail());
            emp.setDepartment(empDetails.getDepartment());
            emp.setDesignation(empDetails.getDesignation());
            emp.setSalary(empDetails.getSalary());
            return repository.save(emp);
        }).orElseThrow(() -> new RuntimeException("Employee not found with id " + id));
    }

    public void deleteEmployee(Long id) {
        repository.deleteById(id);
    }
}
