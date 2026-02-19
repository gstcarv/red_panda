package com.maplewood.infrastructure.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration for JWT-based authentication.
 * Requires Authorization: Bearer &lt;token&gt; header for protected endpoints.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Login endpoints - no auth required
                        .requestMatchers("/login", "/api/login").permitAll()
                        // Swagger / OpenAPI docs (springdoc.api-docs.path=/api)
                        .requestMatchers("/api", "/api/swagger-ui/**", "/api/swagger-ui.html").permitAll()
                        // Actuator health
                        .requestMatchers("/actuator/**").permitAll()
                        // All other API endpoints require Authorization: Bearer token
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.setContentType("application/json");
                            response.getWriter().write(String.format(
                                    "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Unauthorized\"," +
                                            "\"message\":\"Missing or invalid Authorization: Bearer token\",\"path\":\"%s\"}",
                                    java.time.LocalDateTime.now(),
                                    request.getRequestURI()));
                        }));

        return http.build();
    }
}
