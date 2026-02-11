package com.example.leave.service;

import com.example.leave.model.LeaveRequest;
import com.example.leave.repository.LeaveRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveRequestService {
    private final LeaveRequestRepository repository;

    public LeaveRequestService(LeaveRequestRepository repository) {
        this.repository = repository;
    }

    public LeaveRequest saveLeaveRequest(LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        return repository.save(leaveRequest);
    }

    public List<LeaveRequest> getAllLeaveRequests() {
        return repository.findAll();
    }

    public LeaveRequest approveLeave(Long id) {
        LeaveRequest leaveRequest = repository.findById(id).orElseThrow();
        leaveRequest.setStatus("APPROVED");
        return repository.save(leaveRequest);
    }

    public LeaveRequest rejectLeave(Long id) {
        LeaveRequest leaveRequest = repository.findById(id).orElseThrow();
        leaveRequest.setStatus("REJECTED");
        return repository.save(leaveRequest);
    }
}
