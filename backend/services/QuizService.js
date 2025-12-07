const knex = require('../config/database');

const QuizService = {
	getByModuleId: async moduleId => {
		return knex('quizzes').where({ module_id: moduleId }).orderBy('created_at', 'asc');
	},

	getById: async id => {
		return knex('quizzes').where({ id }).first();
	},

	create: async (data) => {
		const existingQuiz = await knex('quizzes')
			.where({ module_id: data.module_id })
			.first();

		if (existingQuiz) {
			const error = new Error('Quiz already exists for this module');
			error.code = '409';
			throw error;
		}

		const [newQuiz] = await knex('quizzes')
			.insert(data)
			.returning('*');
		return newQuiz;
	},

	update: async (id, data) => {
		const [updatedQuiz] = await knex('quizzes').where({ id }).update(data).returning('*');
		return updatedQuiz;
	},

	delete: async id => {
		return knex('quizzes').where({ id }).del();
	},
};

module.exports = QuizService;
