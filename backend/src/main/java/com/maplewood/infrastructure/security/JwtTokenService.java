package com.maplewood.infrastructure.security;

import com.maplewood.application.auth.port.TokenService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT token generator and validator implementation.
 */
@Component
public class JwtTokenService implements TokenService {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtTokenService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms:864000000}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    @Override
    public String generateToken(Integer userId, String email) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    /**
     * Validates and parses the JWT token. Returns claims if valid.
     *
     * @param token the JWT token string
     * @return Claims from the token if valid
     * @throws io.jsonwebtoken.JwtException if the token is invalid or expired
     */
    public Claims validateToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
