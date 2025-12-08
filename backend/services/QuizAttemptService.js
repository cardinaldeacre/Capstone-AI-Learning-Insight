const knex = require('../config/database');

const QuizAttemptService = {
	submitAttempt: async (studentId, quizId, userAnswer) => {
		const correctOptions = await knex('quiz_options as qo')
			.join('quiz_questions as qq', 'qo.question_id', 'qq.id')
			.where('qq.quiz_id', quizId)
			.where('qo.is_correct', true)
			.select('qq.id as question_id', 'qo.id as option_id');

		const totalQuestion = await knex('quiz_questions')
			.where({ quiz_id: quizId })
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
					String(correct.question_id) === String(answer.question_id) &&
					String(correct.option_id) === String(answer.option_id)
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
			.where({ student_id: studentId, quiz_id: quizId })
			.orderBy('id', 'desc');
	},

	checkPassStatus: async attemptId => {
		const attempt = await knex('quiz_attempts').where({ id: attemptId }).first();
		const quiz = await knex('quizzes').where({ id: attempt.quiz_id }).first();

		if (!quiz.min_score) return { passed: true };

		return {
			passed: attempt.score >= quiz.min_score,
			min_score: quiz.min_score,
			your_score: attempt.score,
		};
	},

	getLatestAttemptByQuizId: async (studentId, quizId) => {
		const attempt = await knex('quiz_attempts')
			.join('quizzes', 'quiz_attempts.quiz_id', 'quizzes.id')
			.join('modules', 'quizzes.module_id', 'modules.id')
			.select(
				'quiz_attempts.*',
				'quizzes.min_score',
				'quizzes.title as quiz_title',
				'modules.class_id'
			)
			.where('quiz_attempts.student_id', studentId)
			.where('quiz_attempts.quiz_id', quizId)
			.orderBy('quiz_attempts.created_at', 'desc')
			.first()

		if (!attempt) return null;

		const minScore = attempt.min_score || 0;
		const isPassed = attempt.score >= minScore;

		return {
			...attempt,
			is_passed: isPassed
		};
	}
};

module.exports = QuizAttemptService;
