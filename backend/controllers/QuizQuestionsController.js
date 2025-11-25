const express = require('express');
const router = express.Router();
const QuizQuestionsService = require('../services/QuizQuestionsService');
const {authMiddleware, authorizeRole} = require('../middleware/auth');

router.get('/quiz/:quizId', authMiddleware, async (req, res) => {
	const {quizId} = req.params;

	try {
		const questions = await QuizQuestionsService.getByQuizId(quizId);
		return res.status(200).json({data: questions});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/:id', authMiddleware, async (req, res) => {
	const {id} = req.params;

	try {
		const question = await QuizQuestionsService.getById(id);
		if (!question) {
			return res.status(404).json({message: 'Pertanyaan tidak dquestionukan'});
		}
		return res.status(200).json({data: question});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {quiz_id, questions_text} = req.body;

	if (!quiz_id || !questions_text) {
		return res.status(400).json({message: 'Quiz ID & text pertanyaan harus diisi'});
	}

	try {
		const newQuestion = await QuizQuestionsService.create({
			quiz_id,
			questions_text,
		});

		res.status(201).json({message: 'Pertanyaan berhasil ditambakan', data: newQuestion});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.put('/:id', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {id} = req.params;
	const {question_text} = req.body;

	if (!question_text) {
		return res.status(400).json({message: 'Teks pertanyaan tidak boleh kosong'});
	}

	try {
		const questionId = parseInt(id);
		if (isNaN(questionId)) {
			return res.status(400).json({message: 'ID Pertanyaan tidak valid'});
		}

		const updatedQuestion = await QuizQuestionService.update(questionId, question_text);

		if (!updatedQuestion) {
			return res.status(404).json({message: 'Pertanyaan tidak ditemukan'});
		}

		res.status(200).json({
			message: 'Pertanyaan berhasil diperbarui',
			data: updatedQuestion,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error saat update pertanyaan'});
	}
});

router.delete('/:id', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {id} = req.params;

	try {
		const questionId = parseInt(id);

		if (isNaN(questionId)) {
			return res.status(400).json({message: 'ID question tidak valid'});
		}

		const deletedCount = await Service.delete(questionId);

		if (deletedCount === 0) {
			return res.status(404).json({message: 'Pertanyaan tidak ditemukan'});
		}

		return res.status(200).json({message: 'Pertanyaan berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
