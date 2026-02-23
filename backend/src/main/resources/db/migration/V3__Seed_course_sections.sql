-- Migration V3: Seed course sections for all courses in matching semesters
-- Strategy: Create 2-3 sections for core courses, 1-2 for elective courses

PRAGMA foreign_keys = ON;

-- Helper CTE to map courses to all matching semesters (Fall/Spring order)
WITH course_semester_pairs AS (
    SELECT 
        s.id as semester_id,
        c.id as course_id,
        c.code,
        c.course_type,
        c.specialization_id,
        c.hours_per_week,
        c.semester_order
    FROM courses c
    JOIN semesters s ON s.order_in_year = c.semester_order
),
-- Helper CTE to get course-semester rows with section counts
courses_with_details AS (
    SELECT 
        csp.semester_id,
        csp.course_id,
        csp.code,
        csp.course_type,
        csp.specialization_id,
        csp.hours_per_week,
        csp.semester_order,
        -- Determine number of sections: core=2-3, elective=1-2
        CASE 
            WHEN csp.course_type = 'core' THEN 2 + (ABS(RANDOM()) % 2)  -- 2 or 3
            ELSE 1 + (ABS(RANDOM()) % 2)  -- 1 or 2
        END as num_sections
    FROM course_semester_pairs csp
),
-- Helper CTE to get teachers by specialization
teachers_by_spec AS (
    SELECT 
        t.id as teacher_id,
        t.specialization_id,
        ROW_NUMBER() OVER (PARTITION BY t.specialization_id ORDER BY t.id) as rn
    FROM teachers t
),
-- Helper CTE to get classrooms by room type (via specialization)
classrooms_by_spec AS (
    SELECT 
        cl.id as classroom_id,
        s.id as specialization_id,
        cl.capacity,
        ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY cl.id) as rn
    FROM classrooms cl
    JOIN specializations s ON cl.room_type_id = s.room_type_id
),
-- Generate section assignments
section_assignments AS (
    SELECT 
        cwd.course_id,
        cwd.semester_id,
        -- Rotate through teachers of matching specialization
        (SELECT teacher_id FROM teachers_by_spec 
         WHERE specialization_id = cwd.specialization_id 
         AND rn = ((cwd.course_id * 10 + section_num) % (SELECT COUNT(*) FROM teachers_by_spec WHERE specialization_id = cwd.specialization_id)) + 1
         LIMIT 1) as teacher_id,
        -- Rotate through classrooms of matching specialization
        (SELECT classroom_id FROM classrooms_by_spec 
         WHERE specialization_id = cwd.specialization_id 
         AND rn = ((cwd.course_id * 7 + section_num) % (SELECT COUNT(*) FROM classrooms_by_spec WHERE specialization_id = cwd.specialization_id)) + 1
         LIMIT 1) as classroom_id,
        -- Use classroom capacity
        (SELECT capacity FROM classrooms_by_spec 
         WHERE specialization_id = cwd.specialization_id 
         AND rn = ((cwd.course_id * 7 + section_num) % (SELECT COUNT(*) FROM classrooms_by_spec WHERE specialization_id = cwd.specialization_id)) + 1
         LIMIT 1) as capacity,
        cwd.hours_per_week,
        section_num
    FROM courses_with_details cwd
    CROSS JOIN (
        SELECT 1 as section_num UNION ALL SELECT 2 UNION ALL SELECT 3
    ) sections
    WHERE section_num <= cwd.num_sections
    -- Ensure we have teachers and classrooms available
    AND EXISTS (
        SELECT 1 FROM teachers_by_spec 
        WHERE specialization_id = cwd.specialization_id
    )
    AND EXISTS (
        SELECT 1 FROM classrooms_by_spec 
        WHERE specialization_id = cwd.specialization_id
    )
)
INSERT INTO course_sections (course_id, semester_id, teacher_id, classroom_id, capacity, enrolled_count)
SELECT 
    course_id,
    semester_id,
    teacher_id,
    classroom_id,
    capacity,
    0 as enrolled_count
FROM section_assignments
WHERE teacher_id IS NOT NULL AND classroom_id IS NOT NULL;

-- Now insert meeting times for each section
-- Meeting times strategy:
-- - Courses with 2-3 hours/week: 2 meetings per week (Mon/Wed or Tue/Thu)
-- - Courses with 4-6 hours/week: 3 meetings per week (Mon/Wed/Fri)
-- - Time slots: 08:00-09:00, 09:00-10:00, 10:00-11:00, 13:00-14:00, 14:00-15:00

WITH section_details AS (
    SELECT 
        cs.id as section_id,
        c.hours_per_week,
        cs.course_id,
        -- Determine number of meetings based on hours_per_week
        CASE 
            WHEN c.hours_per_week <= 3 THEN 2  -- 2 meetings
            ELSE 3  -- 3 meetings
        END as num_meetings,
        -- Determine time slot (rotate to avoid conflicts)
        CASE 
            WHEN (cs.id % 5) = 0 THEN '08:00'
            WHEN (cs.id % 5) = 1 THEN '09:00'
            WHEN (cs.id % 5) = 2 THEN '10:00'
            WHEN (cs.id % 5) = 3 THEN '13:00'
            ELSE '14:00'
        END as start_time,
        CASE 
            WHEN (cs.id % 5) = 0 THEN '09:00'
            WHEN (cs.id % 5) = 1 THEN '10:00'
            WHEN (cs.id % 5) = 2 THEN '11:00'
            WHEN (cs.id % 5) = 3 THEN '14:00'
            ELSE '15:00'
        END as end_time
    FROM course_sections cs
    JOIN courses c ON cs.course_id = c.id
),
meeting_times AS (
    SELECT 
        section_id,
        start_time,
        end_time,
        CASE 
            WHEN num_meetings = 2 THEN
                CASE 
                    WHEN (section_id % 2) = 0 THEN 'Monday'
                    ELSE 'Tuesday'
                END
            ELSE 'Monday'  -- First meeting for 3-meeting courses
        END as day1,
        CASE 
            WHEN num_meetings = 2 THEN
                CASE 
                    WHEN (section_id % 2) = 0 THEN 'Wednesday'
                    ELSE 'Thursday'
                END
            ELSE 'Wednesday'  -- Second meeting for 3-meeting courses
        END as day2,
        CASE 
            WHEN num_meetings = 3 THEN 'Friday'  -- Third meeting
            ELSE NULL
        END as day3,
        num_meetings
    FROM section_details
)
INSERT INTO course_section_meeting_times (course_section_id, day_of_week, start_time, end_time)
SELECT section_id, day1, start_time, end_time FROM meeting_times WHERE day1 IS NOT NULL
UNION ALL
SELECT section_id, day2, start_time, end_time FROM meeting_times WHERE day2 IS NOT NULL
UNION ALL
SELECT section_id, day3, start_time, end_time FROM meeting_times WHERE day3 IS NOT NULL;
