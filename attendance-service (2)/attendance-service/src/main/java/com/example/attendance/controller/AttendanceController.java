package com.example.attendance.controller;

import com.example.attendance.model.Attendance;
import com.example.attendance.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService service;

    public AttendanceController(AttendanceService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Attendance> mark(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(service.mark(attendance));
    }

    @GetMapping
    public ResponseEntity<List<Attendance>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{employeeId}/monthly/{year}/{month}")
    public ResponseEntity<List<Attendance>> monthly(@PathVariable Long employeeId,
                                                    @PathVariable int year,
                                                    @PathVariable int month) {
        return ResponseEntity.ok(service.monthly(employeeId, YearMonth.of(year, month)));
    }
}
