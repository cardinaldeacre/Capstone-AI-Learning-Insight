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

	update: async (id, data) => {
		const [updatedModule] = await knex('modules').where({id}).update(data).returning('*');
		return updatedModule;
	},

	delete: async id => {
		return knex('modules').where({id}).del();
	},
};

module.exports = ModulesService;
