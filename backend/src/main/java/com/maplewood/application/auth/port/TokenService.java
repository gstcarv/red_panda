package com.maplewood.application.auth.port;

/**
 * Application port for token generation.
 */
public interface TokenService {

    String generateToken(Integer userId, String email);
}
