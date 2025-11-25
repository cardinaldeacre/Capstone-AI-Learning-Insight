const knex = require('../config/database');

const QuizQuestionsService = {
	getByQuizId: async quizId => {
		return knex('quiz_questions').where({quiz_id: quizId}).orderBy('id', 'asc');
	},

	getById: async id => {
		return knex('quiz_questions').where({id}).first();
	},

	create: async data => {
		const [newQueston] = await knex('quiz_questions').insert(data).returning('*');

		return newQueston;
	},

	update: async (id, data) => {
		const [updatedQuestion] = await knex('quiz_questions').where({id}).update({
			question_text: questionText,
			updated_at: knex.fn.now(),
		});

		return updatedQuestion;
	},

	delete: async id => {
		return knex('quiz_questions').where({id}).del();
	},
};

module.exports = QuizQuestionsService;
