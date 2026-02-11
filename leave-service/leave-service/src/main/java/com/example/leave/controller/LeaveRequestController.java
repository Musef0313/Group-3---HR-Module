/*
 * package com.example.leave.controller;
 * 
 * import com.example.leave.model.LeaveRequest; import
 * com.example.leave.service.LeaveRequestService; import
 * org.springframework.web.bind.annotation.*;
 * 
 * import java.util.List;
 * 
 * @RestController
 * 
 * @RequestMapping("/api/leaves")
 * 
 * public class LeaveRequestController { private final LeaveRequestService
 * service;
 * 
 * public LeaveRequestController(LeaveRequestService service) { this.service =
 * service; }
 * 
 * @PostMapping public LeaveRequest createLeave(@RequestBody LeaveRequest
 * leaveRequest) { return service.saveLeaveRequest(leaveRequest); }
 * 
 * @GetMapping public List<LeaveRequest> getAllLeaves() { return
 * service.getAllLeaveRequests(); }
 * 
 * @PutMapping("/{id}/approve") public LeaveRequest approveLeave(@PathVariable
 * Long id) { return service.approveLeave(id); }
 * 
 * @PutMapping("/{id}/reject") public LeaveRequest rejectLeave(@PathVariable
 * Long id) { return service.rejectLeave(id); } }
 */




package com.example.leave.controller;

import com.example.leave.model.LeaveRequest;
import com.example.leave.service.LeaveRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/leaves")

public class LeaveRequestController {
    private final LeaveRequestService service;

    public LeaveRequestController(LeaveRequestService service) {
        this.service = service;
    }

    @PostMapping
    public LeaveRequest createLeave(@RequestBody LeaveRequest leaveRequest) {
        return service.saveLeaveRequest(leaveRequest);
    }

    @GetMapping
    public List<LeaveRequest> getAllLeaves() {
        return service.getAllLeaveRequests();
    }

    @PutMapping("/{id}/approve")
    public LeaveRequest approveLeave(@PathVariable Long id) {
        return service.approveLeave(id);
    }

    @PutMapping("/{id}/reject")
    public LeaveRequest rejectLeave(@PathVariable Long id) {
        return service.rejectLeave(id);
    }
}
