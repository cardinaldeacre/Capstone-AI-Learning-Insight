const knex = require('../config/database');

const QuizOptionService = {
	getByQustionId: async questionId => {
		return knex('quiz_options').where({question_id: questionId}).orderBy('id', 'asc');
	},

	getById: async id => {
		return knex('quiz_options').where({id}).first();
	},

	create: async data => {
		const [newOption] = await knex('quiz_options').insert(data).returning('*');

		return newOption;
	},

	update: async (id, data) => {
		const [updatedOption] = await knex('quiz_options').where({id}).update(data).returning('*');
		return updatedOption;
	},

	delete: async id => {
		return knex('quiz_options').where({id}).del();
	},
};

module.exports = QuizOptionService;
