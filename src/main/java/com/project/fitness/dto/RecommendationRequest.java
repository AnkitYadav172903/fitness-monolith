package com.project.fitness.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {
    @NotBlank(message = "Activity id is required")
    private String activityId;

    private List<String> improvements;
    private List<String> suggestions;
    private List<String> safety;
}