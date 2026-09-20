package com.project.fitness.dto;

import com.project.fitness.model.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityRequest {
    @NotNull(message = "Activity type is required")
    private ActivityType type;

    private Map<String, Object> additionalMetrics;

    @Positive(message = "Duration must be positive")
    private Integer duration;

    @Positive(message = "Calories burned must be positive")
    private Integer caloriesBurned;

    private LocalDateTime startTime;
}