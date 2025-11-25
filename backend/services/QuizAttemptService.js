const knex = require('../config/database');

const QuizAttemptService = {
	submitAttempt: async (studentId, quizId, userAnswer) => {
		const correctOptions = await knex('quiz_options as qo')
			.join('quiz_question as qq', 'qo.question_id', 'qq.id')
			.where('qq.quiz_id', quizId)
			.where('qo.is_correct', true)
			.select('qq.id as question_id', 'qo.id as option_id');

		const totalQuestion = await knex('quiz_questions')
			.where({quiz_id: quizId})
			.count('id as count')
			.first();

		const totalCount = parseInt(totalQuestion.count) || 0;

		if (totalCount === 0) {
			throw new Error('Quiz ini belum memiliki soal');
		}

		let correctCount = 0;

		userAnswer.forEach(answer => {
			const isCorrect = correctOptions.find(
				correct =>
					correct.question_id == answer.question_id && correct.option_id == answer.option_id
			);

			if (isCorrect) {
				correctCount++;
			}
		});

		const finalScore = correctCount / totalCount * 100;

		const [attempt] = await knex('quiz_attempts')
			.insert({
				quiz_id: quizId,
				student_id: studentId,
				score: finalScore,
			})
			.returning('*');

		return attempt;
	},

	getHistoryByStudent: async (studentId, quizId) => {
		return knex('quiz_attempts')
			.where({student_id: studentId, quiz_id: quizId})
			.orderBy('id', 'desc');
	},

	checkPassStatus: async attemptId => {
		const attempt = await knex('quiz_attempts').where({id: attemptId}).first();
		const quiz = await knex('quizzes').where({id: attempt.quiz_id}).first();

		if (!quiz.min_score) return {passed: true};

		return {
			passed: attempt.score >= quiz.min_score,
			min_score: quiz.min_score,
			your_score: attempt.score,
		};
	},
};

module.exports = QuizAttemptService;
