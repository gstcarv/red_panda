package com.maplewood.application.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Login request payload.
 */
public record LoginRequestDTO(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email
) {
}
