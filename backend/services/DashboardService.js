const knex = require('../config/database');

const DashboardService = {
    getTeacherStats: async (teacherId) => {
        const classes = await knex('classes')
            .where('teacher_id', teacherId)
            .count('id as total')
            .first();

        const students = await knex('class_enrolment')
            .join('classes', 'class_enrolment.class_id', 'classes.id')
            .where('classes.teacher_id', teacherId)
            .countDistinct('class_enrolment.student_id as total')
            .first();

        const submissions = await knex('class_submission')
            .join('class_assignment', 'class_submission.assignment_id', 'class_assignment.id')
            .join('classes', 'class_assignment.class_id', 'classes.id')
            .where('classes.teacher_id', teacherId)
            .where('class_submission.status', 'submitted')
            .count('class_submission.id as total')
            .first();

        return {
            total_classes: parseInt(classes.total || 0),
            total_students: parseInt(students.total || 0),
            pending_submissions: parseInt(submissions.total || 0)
        };
    }
};

module.exports = DashboardService;