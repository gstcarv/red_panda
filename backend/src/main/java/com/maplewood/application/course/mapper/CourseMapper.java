package com.maplewood.application.course.mapper;

import com.maplewood.application.course.dto.CourseDTO;
import com.maplewood.domain.course.model.Course;
import com.maplewood.domain.course.model.CourseType;
import com.maplewood.domain.course.model.SemesterOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

/**
 * MapStruct mapper for converting between Course domain entity and CourseDTO
 * Part of Application Layer
 * 
 * MapStruct generates implementation code at compile time - zero runtime overhead!
 */
@Mapper(componentModel = "spring")
public interface CourseMapper {

    CourseMapper INSTANCE = Mappers.getMapper(CourseMapper.class);

    /**
     * Convert Course domain entity to CourseDTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "code", source = "code")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "credits", source = "credits")
    @Mapping(target = "hoursPerWeek", source = "hoursPerWeek")
    @Mapping(target = "gradeLevel", expression = "java(toGradeLevelDto(course))")
    CourseDTO toDTO(Course course);

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
    Course toEntity(CourseDTO dto);

    /**
     * Convert list of Course entities to list of CourseDTOs
     */
    List<CourseDTO> toDTOList(List<Course> courses);

    /**
     * Convert list of CourseDTOs to list of Course entities
     */
    List<Course> toEntityList(List<CourseDTO> dtos);

    default CourseDTO.GradeLevelDTO toGradeLevelDto(Course course) {
        return new CourseDTO.GradeLevelDTO(course.getGradeLevelMin(), course.getGradeLevelMax());
    }

    default String map(CourseType value) {
        return value == null ? null : value.getValue();
    }

    default CourseType mapCourseType(String value) {
        return CourseType.fromValue(value);
    }

    default Integer map(SemesterOrder value) {
        return value == null ? null : value.getValue();
    }

    default SemesterOrder mapSemesterOrder(Integer value) {
        return SemesterOrder.fromValue(value);
    }
}
