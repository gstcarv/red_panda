package com.maplewood.infrastructure.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

    public static final String ACTIVE_SEMESTER_CACHE = "activeSemesterCache";
    public static final String TEACHER_BY_ID_CACHE = "teacherByIdCache";
    public static final String COURSES_BY_SEMESTER_CACHE = "coursesBySemesterCache";
    public static final String SECTIONS_BY_COURSE_SEMESTER_CACHE = "sectionsByCourseSemesterCache";
    public static final String SECTIONS_BY_COURSES_SEMESTER_CACHE = "sectionsByCoursesSemesterCache";

    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.setAllowNullValues(false);

        cacheManager.registerCustomCache(
                ACTIVE_SEMESTER_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofDays(1))
                        .maximumSize(10_000)
                        .build()
        );

        cacheManager.registerCustomCache(
                TEACHER_BY_ID_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofHours(1))
                        .maximumSize(10_000)
                        .build()
        );

        cacheManager.registerCustomCache(
                COURSES_BY_SEMESTER_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofDays(1))
                        .maximumSize(1_000)
                        .build()
        );

        cacheManager.registerCustomCache(
                SECTIONS_BY_COURSE_SEMESTER_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofMinutes(15))
                        .maximumSize(50_000)
                        .build()
        );

        cacheManager.registerCustomCache(
                SECTIONS_BY_COURSES_SEMESTER_CACHE,
                Caffeine.newBuilder()
                        .expireAfterWrite(Duration.ofMinutes(15))
                        .maximumSize(10_000)
                        .build()
        );

        return cacheManager;
    }
}
