package com.project.fitness.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String firstName;
    private String lastName;

    @DecimalMin(value = "100", message = "Minimum height is 100 cm")
    @DecimalMax(value = "250", message = "Maximum height is 250 cm")
    private Double height;

    @DecimalMin(value = "30", message = "Minimum weight is 30 kg")
    @DecimalMax(value = "300", message = "Maximum weight is 300 kg")
    private Double weight;

    @Size(max = 150, message = "Bio maximum 150 characters")
    private String bio;
}