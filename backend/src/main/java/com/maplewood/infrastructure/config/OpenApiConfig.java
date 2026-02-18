package com.maplewood.infrastructure.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger configuration
 * Access Swagger UI at: http://localhost:8080/api/swagger-ui.html
 * Access API docs at: http://localhost:8080/api
 * Part of Infrastructure Layer
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI maplewoodOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Maplewood High School Course Planning API")
                        .description("API for course browsing, enrollment, and student academic tracking")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Maplewood High School")
                                .email("info@maplewood.edu"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
