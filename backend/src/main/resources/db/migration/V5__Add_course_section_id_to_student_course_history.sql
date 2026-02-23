-- Migration V5: Add course_section_id to student_course_history
-- Backfill strategy:
-- 1) Prefer the student's enrollment section for the same course+semester
-- 2) Fallback to any section from the same course+semester

PRAGMA foreign_keys = OFF;

ALTER TABLE student_course_history
    ADD COLUMN course_section_id INTEGER;

UPDATE student_course_history AS sch
SET course_section_id = COALESCE(
    (
        SELECT se.section_id
        FROM student_enrollments se
        WHERE se.student_id = sch.student_id
          AND se.course_id = sch.course_id
          AND se.semester_id = sch.semester_id
        ORDER BY se.id DESC
        LIMIT 1
    ),
    (
        SELECT cs.id
        FROM course_sections cs
        WHERE cs.course_id = sch.course_id
          AND cs.semester_id = sch.semester_id
        ORDER BY cs.id
        LIMIT 1
    )
);

CREATE TABLE student_course_history_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    course_section_id INTEGER NOT NULL,
    semester_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (course_section_id) REFERENCES course_sections(id),
    FOREIGN KEY (semester_id) REFERENCES semesters(id),
    UNIQUE(student_id, course_id, semester_id)
);

INSERT INTO student_course_history_new (
    id,
    student_id,
    course_id,
    course_section_id,
    semester_id,
    status,
    created_at
)
SELECT
    id,
    student_id,
    course_id,
    course_section_id,
    semester_id,
    status,
    created_at
FROM student_course_history;

DROP TABLE student_course_history;
ALTER TABLE student_course_history_new RENAME TO student_course_history;

CREATE INDEX idx_student_course_history_student ON student_course_history(student_id);
CREATE INDEX idx_student_course_history_course ON student_course_history(course_id);
CREATE INDEX idx_student_course_history_section ON student_course_history(course_section_id);
CREATE INDEX idx_student_course_history_semester ON student_course_history(semester_id);

-- Recreate triggers because the table was rebuilt.
CREATE TRIGGER enforce_prerequisite_completion
    BEFORE INSERT ON student_course_history
    FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN (
            SELECT c.prerequisite_id FROM courses c WHERE c.id = NEW.course_id
        ) IS NOT NULL AND NOT EXISTS (
            SELECT 1 FROM student_course_history sch
            WHERE sch.student_id = NEW.student_id
            AND sch.course_id = (SELECT c.prerequisite_id FROM courses c WHERE c.id = NEW.course_id)
            AND sch.status = 'passed'
        )
        THEN RAISE(ABORT, 'Student must pass prerequisite course before enrolling in this course.')
    END;
END;

CREATE TRIGGER prevent_duplicate_passed_course
    BEFORE INSERT ON student_course_history
    FOR EACH ROW
    WHEN NEW.status = 'passed'
BEGIN
    SELECT CASE
        WHEN EXISTS (
            SELECT 1 FROM student_course_history sch
            WHERE sch.student_id = NEW.student_id
            AND sch.course_id = NEW.course_id
            AND sch.status = 'passed'
        )
        THEN RAISE(ABORT, 'Student has already passed this course.')
    END;
END;

PRAGMA foreign_keys = ON;
