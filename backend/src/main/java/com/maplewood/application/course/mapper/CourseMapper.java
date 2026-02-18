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
    @Mapping(target = "description", source = "description")
    @Mapping(target = "credits", source = "credits")
    @Mapping(target = "hoursPerWeek", source = "hoursPerWeek")
    @Mapping(target = "courseType", source = "courseType")
    @Mapping(target = "gradeLevelMin", source = "gradeLevelMin")
    @Mapping(target = "gradeLevelMax", source = "gradeLevelMax")
    @Mapping(target = "semesterOrder", source = "semesterOrder")
    CourseDTO toDTO(Course course);

    /**
     * Convert CourseDTO to Course domain entity
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "code", source = "code")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "credits", source = "credits")
    @Mapping(target = "hoursPerWeek", source = "hoursPerWeek")
    @Mapping(target = "courseType", source = "courseType")
    @Mapping(target = "gradeLevelMin", source = "gradeLevelMin")
    @Mapping(target = "gradeLevelMax", source = "gradeLevelMax")
    @Mapping(target = "semesterOrder", source = "semesterOrder")
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
