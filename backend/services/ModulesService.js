const knex = require('../config/database');

const ModulesService = {
	getByClassId: async (classId) => {
		const modules = await knex('modules')
			.where('class_id', classId)
			.orderBy('order_number', 'asc');

		for (let mod of modules) {
			const quiz = await knex('quizzes').where('module_id', mod.id).first();
			mod.quiz = quiz || null;
		}

		return modules;
	},

	getByCourseId: async (classId, userId) => {
		const modules = await knex('modules')
			.where('class_id', classId)
			.orderBy('order_number', 'asc');

		for (let mod of modules) {
			const quiz = await knex('quizzes').where('module_id', mod.id).first();

			if (quiz) {
				const bestAttempt = await knex('quiz_attempts')
					.where({
						quiz_id: quiz.id,
						student_id: userId
					})
					.orderBy('score', 'desc')
					.first();

				const minScore = quiz.min_score || 0;
				const isPassed = bestAttempt ? bestAttempt.score >= minScore : false;

				mod.quiz_info = {
					id: quiz.id,
					title: quiz.title,
					is_passed: isPassed,
					user_score: bestAttempt ? bestAttempt.score : null
				};
			} else {
				mod.quiz_info = null;
			}

			const assignment = await knex('class_assignment')
				.where('class_id', classId)
				.first();

			if (assignment) {
				const submission = await knex('class_submission')
					.where({ assignment_id: assignment.id, student_id: userId })
					.first();

				let submissionStatus = 'not_started';
				let isAssignmentPassed = false;

				if (submission) {
					submissionStatus = submission.status;

					if (submission.status === 'graded') {
						if (submission.score >= assignment.min_score) {
							isAssignmentPassed = true;
						} else {
							isAssignmentPassed = false;
						}
					} else if (submission.status === 'submitted') {
						isAssignmentPassed = true;
					}
				} else {
					isAssignmentPassed = false;
				}

				mod.assignment_info = {
					id: assignment.id,
					title: assignment.title,
					min_score: assignment.min_score,
					user_score: submission ? submission.score : 0,
					status: submissionStatus,
					is_passed: isAssignmentPassed
				};
			}

		}
		return modules;
	},

	getById: async id => {
		return knex('modules').where({ id }).first();
	},

	create: async data => {
		const [newModule] = await knex('modules').insert(data).returning('*');
		return newModule;
	},

	update: async (moduleId, updatedData) => {
		const [updatedModule] = await knex('modules')
			.where({ id: moduleId })
			.update(updatedData)
			.returning('*');
		return updatedModule;
	},

	delete: async moduleId => {
		return knex('modules').where({ id: moduleId }).del();
	},
};

module.exports = ModulesService;
