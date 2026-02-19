package com.maplewood.infrastructure.config;

import com.maplewood.application.course.mapper.CourseMapper;
import com.maplewood.application.course.mapper.CourseMapperImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for MapStruct mappers
 * Ensures MapStruct-generated mappers are properly registered as Spring beans
 */
@Configuration
public class MapperConfig {

    @Bean
    public CourseMapper courseMapper() {
        return new CourseMapperImpl();
    }
}
