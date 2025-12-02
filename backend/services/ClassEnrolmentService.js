const knex = require('../config/database');

const ClassEnrolmentService = {
	enrollStudent: async (studentId, classId) => {
		const existing = await knex('class_enrolment')
			.where({ student_id: studentId, class_id: classId })
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
		return knex('class_enrolment').where({ student_id: studentId, class_id: classId }).del();
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

	getStudentsByClass: async classId => {
		return knex('class_enrolment as ce')
			.join('users as u', 'ce.student_id', 'u.id')
			.where('ce.class_id', classId)
			.select('u.id as student_id', 'u.name', 'u.email', 'ce.enrolled_at');
	},

	isEnrolled: async (studentId, classId) => {
		const check = await knex('class_enrolment')
			.where({ student_id: studentId, class_id: classId })
			.first();

		return !!check; // true/false
	},

	getFinishedClasses: async studentId => {
		const myClasses = await knex('class_enrolment as ce')
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

		const finishedClasses = [];
		for (let kelas of myClasses) {
			const totalModulesRes = await knex('modules')
				.where('class_id', kelas.class_id)
				.count('id as count').first()
			const totalModules = parseInt(totalModulesRes.count) || 0;

			const completedModulesRes = await knex('modules_progress as mp')
				.join('modules as m', 'mp.module_id', 'm.id')
				.where('m.class_id', kelas.class_id)
				.where('mp.student_id', studentId)
				.whereNotNull('mp.completed_at')
				.count('mp.id as count').first();

			const completedModules = parseInt(completedModulesRes.count) || 0;

			const totalAssignmentsRes = await knex('class_assignment')
				.where('class_id', kelas.class_id)
				.count('id as count').first()
			const totalAssignments = parseInt(totalAssignmentsRes.count) || 0

			const submittedAssignmentsRes = await knex('class_submission as cs')
				.join('class_assignment as ca', 'cs.assignment_id', 'ca.id')
				.where('ca.class_id', kelas.class_id)
				.where('cs.student_id', studentId)
				.whereIn('cs.status', ['submitted', 'graded'])
				.count('cs.id as count').first();
			const submittedAssignments = parseInt(submittedAssignmentsRes.count) || 0;

			const totalItems = totalModules + totalAssignments;
			const totalCompleted = completedModules + submittedAssignments;

			let progress = 0;
			if (totalItems > 0) {
				progress = Math.round((totalCompleted / totalItems) * 100);
			}

			if (progress === 100) {
				finishedClasses.push({
					...kelas,
					progress: 100,
					stats: {
						modules: `${completedModules}/${totalModules}`,
						assignments: `${submittedAssignments}/${totalAssignments}`
					}
				});
			}
		}
		return finishedClasses
	}
};

module.exports = ClassEnrolmentService;
