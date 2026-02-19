package com.maplewood.application.auth.dto;

/**
 * Login response payload with generated JWT.
 */
public record LoginResponseDTO(
        String token,
        long expiresIn,
        String email,
        Integer userId
) {
}
