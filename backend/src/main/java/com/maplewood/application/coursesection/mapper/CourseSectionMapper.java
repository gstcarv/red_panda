package com.maplewood.application.coursesection.mapper;

import com.maplewood.application.coursesection.dto.CourseSectionDTO;
import com.maplewood.domain.coursesection.model.CourseSection;
import com.maplewood.domain.coursesection.model.CourseSection.MeetingTime;
import com.maplewood.infrastructure.persistence.entity.TeacherJpaEntity;
import com.maplewood.infrastructure.persistence.repository.TeacherRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

/**
 * MapStruct mapper for converting between CourseSection domain entity and CourseSectionDTO
 * Part of Application Layer
 */
@Mapper(componentModel = "spring")
public abstract class CourseSectionMapper {

    @Autowired
    protected TeacherRepository teacherRepository;

    /**
     * Convert CourseSection domain entity to CourseSectionDTO
     */
    @Mapping(target = "teacher", expression = "java(mapTeacher(section.getTeacherId()))")
    @Mapping(target = "meetingTimes", expression = "java(mapMeetingTimes(section.getMeetingTimes()))")
    public abstract CourseSectionDTO toDTO(CourseSection section);

    /**
     * Convert list of CourseSection entities to list of CourseSectionDTOs
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
     * Map teacher ID to TeacherDTO by fetching teacher name from repository
     */
    protected CourseSectionDTO.TeacherDTO mapTeacher(Integer teacherId) {
        if (teacherId == null) {
            return null;
        }
        
        Optional<TeacherJpaEntity> teacherOpt = teacherRepository.findById(teacherId);
        if (teacherOpt.isEmpty()) {
            return new CourseSectionDTO.TeacherDTO(teacherId, "Unknown");
        }
        
        TeacherJpaEntity teacher = teacherOpt.get();
        String fullName = teacher.getFirstName() + " " + teacher.getLastName();
        return new CourseSectionDTO.TeacherDTO(teacherId, fullName);
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
