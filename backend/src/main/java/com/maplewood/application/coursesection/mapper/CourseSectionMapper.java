package com.maplewood.application.coursesection.mapper;

import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.model.CourseSection.MeetingTime;
import com.maplewood.domain.teacher.model.Teacher;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Map;

/**
 * MapStruct mapper for converting between CourseSection domain entity and CourseSectionDTO
 * Part of Application Layer
 * 
 * IMPORTANT: Mappers should NEVER call repositories or perform I/O operations.
 * All data enrichment (like teachers) must be done in Use Cases and passed as parameters.
 */
@Mapper(componentModel = "spring")
public abstract class CourseSectionMapper {

    /**
     * Convert CourseSection domain entity to CourseSectionDTO
     * Note: teacher field is ignored - use toDTOList with teachers map for batch loading
     */
    @Mapping(target = "teacher", ignore = true)
    @Mapping(target = "meetingTimes", expression = "java(mapMeetingTimes(section.getMeetingTimes()))")
    public abstract CourseSectionDTO toDTO(CourseSection section);

    /**
     * Convert CourseSection to CourseSectionDTO with teacher enrichment
     */
    public CourseSectionDTO toDTO(CourseSection section, Map<Integer, Teacher> teachersById) {
        CourseSectionDTO dto = toDTO(section);
        if (section != null && section.getTeacherId() != null) {
            Teacher teacher = teachersById.get(section.getTeacherId());
            if (teacher != null) {
                dto.setTeacher(new CourseSectionDTO.TeacherDTO(teacher.getId(), teacher.getFullName()));
            } else {
                dto.setTeacher(new CourseSectionDTO.TeacherDTO(section.getTeacherId(), "Unknown"));
            }
        }
        return dto;
    }

    /**
     * Convert list of CourseSection entities to list of CourseSectionDTOs with batch-loaded teachers
     */
    public List<CourseSectionDTO> toDTOList(List<CourseSection> sections, Map<Integer, Teacher> teachersById) {
        if (sections == null) {
            return null;
        }
        return sections.stream()
                .map(section -> toDTO(section, teachersById))
                .toList();
    }

    /**
     * Convert list of CourseSection entities to list of CourseSectionDTOs (without teachers)
     * Note: Use toDTOList with teachers map for proper teacher enrichment
     */
    public List<CourseSectionDTO> toDTOList(List<CourseSection> sections) {
        if (sections == null) {
            return null;
        }
        return sections.stream()
                .map(this::toDTO)
                .toList();
    }

    /**
     * Map MeetingTime domain objects to MeetingTimeDTOs
     */
    protected List<CourseSectionDTO.MeetingTimeDTO> mapMeetingTimes(List<MeetingTime> meetingTimes) {
        if (meetingTimes == null) {
            return null;
        }
        
        return meetingTimes.stream()
                .map(mt -> new CourseSectionDTO.MeetingTimeDTO(
                        mt.getDayOfWeek(),
                        mt.getStartTime(),
                        mt.getEndTime()
                ))
                .toList();
    }
}
