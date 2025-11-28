const knex = require('../config/database');

const ClassAssignmentService = {
	getByClassId: async classId => {
		return knex('class_assignment').where({class_id: classId}).orderBy('created_at', 'desc');
	},

	getById: async id => {
		return knex('class_assignment').where({id}).first();
	},

	create: async data => {
		const [newAssignment] = await knex('class_assignment').insert(data).returning('*');
		return newAssignment;
	},

	update: async (id, data) => {
		const [updatedAssignment] = await knex('class_assignment')
			.where('id', id)
			.update({...data, update_at: knex.fn.now()})
			.returning('*');

		return updatedAssignment;
	},

	delete: async id => {
		return knex('class_assignment').where('id', id).del();
	},

	getClassIdByAssignmentId: async id => {
		const assignment = await knex('class_assignment').where('id', id).select('class_id').first();
		return assignment ? assignment.class_id : null;
	},
};

module.exports = ClassAssignmentService;
