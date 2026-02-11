package com.example.attendance.service;

import com.example.attendance.client.EmployeeClient;
import com.example.attendance.model.Attendance;
import com.example.attendance.repository.AttendanceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository repo;
    private final EmployeeClient employeeClient;

    public AttendanceService(AttendanceRepository repo, EmployeeClient employeeClient) {
        this.repo = repo;
        this.employeeClient = employeeClient;
    }

    @Transactional
    public Attendance mark(Attendance attendance) {
        var emp = employeeClient.getEmployee(attendance.getEmployeeId());
        if (emp == null || emp.id == null) {
            throw new IllegalArgumentException("Employee not found: " + attendance.getEmployeeId());
        }
        attendance.setDate(LocalDate.now());
        return repo.save(attendance);
    }

    public List<Attendance> getAll() {
        return repo.findAll();
    }

    public List<Attendance> monthly(Long employeeId, YearMonth ym) {
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return repo.findByEmployeeIdAndDateBetween(employeeId, start, end);
    }
}
