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
    },

    getLearningInsight: async (studentId) => {
        const learningInsight = await knex('learning_insight')
            .select('id', 'insight_text')
            .select(knex.raw("created_at::date - interval '7 days' as from"))
            .select(knex.raw("created_at::date - interval '1 day' as to"))
            .where('student_id', studentId)
            .orderBy('created_at', 'desc')
            .first();

        if (!learningInsight) {
            return {
                from: null,
                to: null,
                insightText: '',
                patternByTime: {
                    morning: 0,
                    afternoon: 0,
                    evening: 0,
                    night: 0,
                },
                completionByDay: {
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0,
                    saturday: 0,
                    sunday: 0,
                },
            }
        }

        const patternByTime = await knex('modules_progress')
            .select(knex.raw('SUM(CASE WHEN EXTRACT(HOUR FROM completed_at) BETWEEN 5 AND 11 THEN 1 ELSE 0 END) AS morning'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(HOUR FROM completed_at) BETWEEN 12 AND 16 THEN 1 ELSE 0 END) AS afternoon'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(HOUR FROM completed_at) BETWEEN 17 AND 20 THEN 1 ELSE 0 END) AS evening'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(HOUR FROM completed_at) BETWEEN 21 AND 23 OR EXTRACT(HOUR FROM completed_at) BETWEEN 0 AND 4 THEN 1 ELSE 0 END) AS night'))
            .join('learning_insight', 'modules_progress.student_id', 'learning_insight.student_id')
            .where('learning_insight.id', learningInsight.id)
            .where(knex.raw('completed_at::date'), '>=', knex.raw("created_at::date - interval '7 days'"))
            .where(knex.raw('completed_at::date'), '<', knex.raw("created_at::date"))
            .groupBy('learning_insight.student_id', 'learning_insight.student_id')
            .first();

        const completionByDay = await knex('modules_progress')
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 1 THEN 1 ELSE 0 END) AS monday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 2 THEN 1 ELSE 0 END) AS tuesday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 3 THEN 1 ELSE 0 END) AS wednesday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 4 THEN 1 ELSE 0 END) AS thursday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 5 THEN 1 ELSE 0 END) AS friday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 6 THEN 1 ELSE 0 END) AS saturday'))
            .select(knex.raw('SUM(CASE WHEN EXTRACT(DOW FROM completed_at) = 0 THEN 1 ELSE 0 END) AS sunday'))
            .join('learning_insight', 'modules_progress.student_id', 'learning_insight.student_id')
            .where('learning_insight.id', learningInsight.id)
            .where(knex.raw('completed_at::date'), '>=', knex.raw("created_at::date - interval '7 days'"))
            .where(knex.raw('completed_at::date'), '<', knex.raw("created_at::date"))
            .groupBy('learning_insight.student_id', 'learning_insight.student_id')
            .first();

        return {
            from: learningInsight.from,
            to: learningInsight.to,
            insightText: learningInsight.insight_text,
            patternByTime,
            completionByDay,
        }
    }
};

module.exports = DashboardService;