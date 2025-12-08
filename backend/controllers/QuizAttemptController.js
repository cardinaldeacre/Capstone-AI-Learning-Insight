const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const QuizAttemptService = require('../services/QuizAttemptService');

router.get('/history/:quizId', authMiddleware, async (req, res) => {
	const studentId = req.user.id;
	const { quizId } = req.params;

	try {
		const history = await QuizAttemptService.getHistoryByStudent(studentId, quizId);
		return res.status(200).json({ data: history });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server' });
	}
});

router.post('/', authMiddleware, async (req, res) => {
	const studentId = req.user.id;
	const { quiz_id, answers } = req.body;

	if (!quiz_id || !Array.isArray(answers)) {
		return res.status(400).json({ message: 'Quiz ID & array jawaban harus diisi' });
	}

	try {
		const attempt = await QuizAttemptService.submitAttempt(studentId, quiz_id, answers);
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
		return res.status(500).json({ message: 'Error server' });
	}
});

router.get('/latest/:quizId', authMiddleware, async (req, res) => {
	const { quizId } = req.params;
	const studentId = req.user.id;

	try {
		const result = await QuizAttemptService.getLatestAttemptByQuizId(studentId, quizId);

		if (!result) {
			return res.status(404).json({ message: "Hasil quiz tdak ditemukan" })
		}

		return res.status(200).json({ data: result });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Servre error" })
	}
})

module.exports = router;
