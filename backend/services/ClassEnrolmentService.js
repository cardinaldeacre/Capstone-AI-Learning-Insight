const knex = require('../config/database');

const ClassEnrolmentService = {
	enrollStudent: async (studentId, classId) => {
		const existing = await knex('class_enrolment')
			.where({student_id: studentId, class_id: classId})
			.first();

		if (existing) {
			throw new Error('already_enrolled');
		}

		const [enrolment] = await knex('class_enrolment');
		insert({
			student_id: studentId,
			class_id: classId,
			enrolled_at: knex.fn.now(),
		}).returning('*');

		return enrolment;
	},

	unenrollStudent: async (studentId, classId) => {
		return knex('class_enrolment').where({student_id: studentId, class_id: classId}).del();
	},

	getClassesByStudent: async studentId => {
		return knex('class_enrolment as ce')
			.join('classes as c', 'ce.class_id', 'c.id')
			.join('users as u', 'c.teacher_id', 'u.id')
			.where('ce.student_id', studentId)
			.select(
				'c.id as class_id',
				'c.title',
				'c.description',
				'u.name as teacher_name',
				'ce.enrolled_at'
			);
	},

	getStudentByClass: async classId => {
		return knex('class_enrolment as ce')
			.join('users as u', 'ce.student_id', 'u.id')
			.where('ce.class_id', classId)
			.select('u.id as student_id', 'u.name', 'u.email', 'ce.enrolled_at');
	},

	isEnrolled: async (studentId, classId) => {
		const check = await knex('class_enrolment')
			.where({student_id: studentId, class_id: classId})
			.first();

		return !!check; // true/false
	},
};

module.exports = ClassEnrolmentService;
