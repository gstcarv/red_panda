-- Migration V4: Create student_enrollments table

PRAGMA foreign_keys = ON;

CREATE TABLE student_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    semester_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (section_id) REFERENCES course_sections(id),
    FOREIGN KEY (semester_id) REFERENCES semesters(id),
    UNIQUE(student_id, course_id, semester_id)
);

CREATE INDEX idx_student_enrollments_student ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_semester ON student_enrollments(semester_id);
CREATE INDEX idx_student_enrollments_student_semester ON student_enrollments(student_id, semester_id);
