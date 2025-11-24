const knex = require('../config/database');

const ModulesService = {
	getByClassId: async classId => {
		return knex('modules').where({class_id: classId}).orderBy('order_number', 'asc');
	},

	getById: async id => {
		return knex('modules').where({id}).first();
	},

	create: async data => {
		const [newModule] = await knex('modules').insert(data).returning('*');
		return newModule;
	},

	update: async (moduleId, updatedData) => {
		const [updatedModule] = await knex('modules')
			.where({id: moduleId})
			.update(updatedData)
			.returning('*');
		return updatedModule;
	},

	delete: async moduleId => {
		return knex('modules').where({id: moduleId}).del();
	},
};

module.exports = ModulesService;
