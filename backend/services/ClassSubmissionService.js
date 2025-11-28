const knex = require('../config/database');

const ClassSubmissionService = {
	getAllByAssignment: async assignmentId => {
		return knex('class_submission')
			.where('assignment_id', assignmentId)
			.select('class_submission.*', 'users.name as student_name', 'users.email as student_email')
			.join('users', 'class_submission.student_id', 'users.id');
	},

	getById: async id => {
		return knex('class_submission')
			.where('class_submission.id', id)
			.select(
				'class_submission.*',
				'users.name as student_name',
				'class_assignment.title as assignment_title',
				'class_assignment.class_id as class_id'
			)
			.join('users', 'class_submission.student_id', 'users.id')
			.join('class_assignment', 'class_submission.assignment_id', 'class_assignment.id')
			.first();
	},

	getByAssignmentAndStudent: async (assignmentId, studentId) => {
		return knex('class_submission')
			.where({
				assignment_id: assignmentId,
				student_id: studentId,
			})
			.first();
	},

	create: async (assignmentId, studentId) => {
		const existing = await ClassSubmissionService.getByAssignmentAndStudent(
			assignmentId,
			studentId
		);
		if (existing) {
			const error = new Error('Submission already exists for this student and assignment.');
			error.code = '409';
			throw error;
		}

		const data = {
			assignment_id: assignmentId,
			student_id: studentId,
			status: 'submitted',
			submitted_at: knex.fn.now(),
			score: 0.0,
		};

		const [newSubmission] = await knex('class_submission').insert(data).returning('*');
		return newSubmission;
	},

	update: async (id, data) => {
		const [updatedSubmission] = await knex('class_submission')
			.where('id', id)
			.update(data)
			.returning('*');

		return updatedSubmission;
	},

	delete: async id => {
		return knex('class_submission').where('id', id).del();
	},
};

module.exports = ClassSubmissionService;
