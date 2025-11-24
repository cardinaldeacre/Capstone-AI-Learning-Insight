const knex = require('../config/database');

const ModulesProgressService = {
	markStarted: async (studentId, moduleId) => {
		const existing = await knex('modules_progress')
			.where({student_id: studentId, module_id: moduleId})
			.first();

		if (existing) {
			return existing; // kalau ada biarin
		}

		const [record] = await knex('modules_progress')
			.insert({
				student_id: studentId,
				module_id: moduleId,
				started_at: knex.fn.now(),
				completed_at: null,
			})
			.returning('*');

		return record;
	},

	markCompleted: async (studentId, moduleId) => {
		const [updateRecord] = await knex('modules_progress')
			.where({student_id: studentId, module_id: moduleId})
			.update({
				completed_at: knex.fn.now(),
			})
			.returning('*');

		return updateRecord;
	},

	getProgressByClass: async (studentId, classId) => {
		return knex('modules as m')
			.leftJoin('modules_progress as mp', function() {
				this.on('m.id', '=', 'mp.module_id').andOn(
					'mp.student_id',
					'=',
					knex.raw('?', [studentId])
				);
			})
			.where('m.class_id', classId)
			.select('m.id as module_id', 'm.title', 'm.order_number', 'mp.started_at', 'mp.completed_at')
			.orderBy('m.order_number', 'asc');
	},
};

module.exports = ModulesProgressService;
