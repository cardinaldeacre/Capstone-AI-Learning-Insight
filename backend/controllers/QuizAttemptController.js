const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/auth');
const QuizAttemptService = require('../services/QuizAttemptService');

router.get('/history/:quizId', authMiddleware, async (req, res) => {
	const studentId = req.user.id;
	const {quizId} = req.params;

	try {
		const history = await QuizAttemptService.getHistoryByStudent(studentId, quizId);
		return res.status(200).json({data: history});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, async (req, res) => {
	const studentId = req.user.id;
	const {quiz_id, userAnswer} = req.body;

	if (!quiz_id || !Array.isArray(userAnswer)) {
		return res.status(400).json({message: 'Quiz ID & array jawaban harus diisi'});
	}

	try {
		const attempt = await QuizAttemptService.submitAttempt(studentId, quiz_id, userAnswer);
		const status = await QuizAttemptService.checkPassStatus(attempt.id); // status kelslusan

		return res.status(201).json({
			message: 'Quiz berhasil di submit',
			data: {
				...attempt,
				is_passed: status.passed,
				min_score: status.min_score,
			},
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

module.exports = router;
