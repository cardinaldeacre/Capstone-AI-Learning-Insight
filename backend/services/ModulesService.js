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
