package com.maplewood.application.course.mapper;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.model.CourseType;
import com.maplewood.domain.course.model.SemesterOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

/**
 * MapStruct mapper for converting between Course domain entity and CourseDTO
 * Part of Application Layer
 * 
 * MapStruct generates implementation code at compile time - zero runtime overhead!
 * 
 * IMPORTANT: Mappers should NEVER call repositories or perform I/O operations.
 * All data enrichment (like sections, prerequisites, semester) must be done in Use Cases.
 */
@Mapper(componentModel = "spring")
public abstract class CourseMapper {

    /**
     * Convert Course domain entity to CourseDTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "code", source = "code")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "credits", source = "credits")
    @Mapping(target = "hoursPerWeek", source = "hoursPerWeek")
    @Mapping(target = "gradeLevel", expression = "java(toGradeLevelDto(course))")
    @Mapping(target = "availableSections", ignore = true)
    @Mapping(target = "prerequisite", ignore = true)
    @Mapping(target = "semester", ignore = true)
    public abstract CourseDTO toDTO(Course course);

    /**
     * Convert CourseDTO to Course domain entity
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "code", source = "code")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", ignore = true)
    @Mapping(target = "credits", source = "credits")
    @Mapping(target = "hoursPerWeek", source = "hoursPerWeek")
    @Mapping(target = "courseType", ignore = true)
    @Mapping(target = "gradeLevelMin", expression = "java(dto.getGradeLevel() != null ? dto.getGradeLevel().getMin() : null)")
    @Mapping(target = "gradeLevelMax", expression = "java(dto.getGradeLevel() != null ? dto.getGradeLevel().getMax() : null)")
    @Mapping(target = "semesterOrder", ignore = true)
    @Mapping(target = "specializationId", ignore = true)
    @Mapping(target = "prerequisiteId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    public abstract Course toEntity(CourseDTO dto);

    /**
     * Convert list of Course entities to list of CourseDTOs
     */
    public List<CourseDTO> toDTOList(List<Course> courses) {
        return courses.stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Convert list of CourseDTOs to list of Course entities
     */
    public abstract List<Course> toEntityList(List<CourseDTO> dtos);

    protected CourseDTO.GradeLevelDTO toGradeLevelDto(Course course) {
        return new CourseDTO.GradeLevelDTO(course.getGradeLevelMin(), course.getGradeLevelMax());
    }

    protected String map(CourseType value) {
        return value == null ? null : value.getValue();
    }

    protected CourseType mapCourseType(String value) {
        return CourseType.fromValue(value);
    }

    protected Integer map(SemesterOrder value) {
        return value == null ? null : value.getValue();
    }

    protected SemesterOrder mapSemesterOrder(Integer value) {
        return SemesterOrder.fromValue(value);
    }
}
