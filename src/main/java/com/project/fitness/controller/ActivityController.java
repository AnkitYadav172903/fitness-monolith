package com.project.fitness.controller;

import com.project.fitness.dto.ActivityRequest;
import com.project.fitness.dto.ActivityResponse;
import com.project.fitness.service.ActivityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping
    public ResponseEntity<ActivityResponse> trackActivity(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.trackActivity(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getUserActivity(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }
}