-- Migration V2: Create course_sections and course_section_meeting_times tables

PRAGMA foreign_keys = ON;

-- Table: course_sections
CREATE TABLE course_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    semester_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    classroom_id INTEGER NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 10),
    enrolled_count INTEGER DEFAULT 0 CHECK (enrolled_count >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (semester_id) REFERENCES semesters(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    UNIQUE(course_id, semester_id, teacher_id, classroom_id)
);

-- Table: course_section_meeting_times
CREATE TABLE course_section_meeting_times (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_section_id INTEGER NOT NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')),
    start_time VARCHAR(5) NOT NULL CHECK (start_time LIKE '__:__'),
    end_time VARCHAR(5) NOT NULL CHECK (end_time LIKE '__:__'),
    FOREIGN KEY (course_section_id) REFERENCES course_sections(id) ON DELETE CASCADE,
    CHECK (end_time > start_time)
);

-- Create indexes for performance
CREATE INDEX idx_course_sections_course ON course_sections(course_id);
CREATE INDEX idx_course_sections_semester ON course_sections(semester_id);
CREATE INDEX idx_course_sections_course_semester ON course_sections(course_id, semester_id);
CREATE INDEX idx_meeting_times_section ON course_section_meeting_times(course_section_id);
