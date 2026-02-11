package com.example.attendance.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "employee-service", url = "http://localhost:8081/employees")
public interface EmployeeClient {
    @GetMapping("/{id}")
    EmployeeDTO getEmployee(@PathVariable("id") Long id);

    class EmployeeDTO {
        public Long id;
        public String name;
        public String email;
        public String department;
    }
}
