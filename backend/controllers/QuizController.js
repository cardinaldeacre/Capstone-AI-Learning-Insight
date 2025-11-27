const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const QuizService = require('../services/QuizService');

router.get('/module/:moduleId', authMiddleware, async (req, res) => {
	const {moduleId} = req.params;

	try {
		const quizzes = await QuizService.getByModuleId(moduleId);
		return res.status(200).json({data: quizzes});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/:id', authMiddleware, async (req, res) => {
	const {id} = req.params;

	try {
		const quiz = await QuizService.getById(id);
		if (!quiz) {
			return res.status(404).json({message: 'Quiz tidak ditemukan'});
		}

		return res.status(200).json({data: quiz});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {module_id, title, timer, min_score} = req.body;

	if (!module_id || !title || !timer) {
		return res.status(400).json({message: 'Module id, judul & timer wajib diisi'});
	}

	try {
		const newQuiz = await QuizService.create({
			module_id,
			title,
			timer: parseInt(timer),
			min_score: min_score ? parseInt(min_score) : null,
		});

		res.status(201).json({
			message: 'Quiz berhasil dibuat',
			data: newQuiz,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.put('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const {id} = req.params;
	const updatedData = req.body;

	if (Object.keys(updatedData).length === 0) {
		return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
	}

	try {
		const existingQuiz = await QuizService.getById(id);
		if (!existingQuiz) {
			return res.status(404).json({message: 'Quiz tidak ditemukan'});
		}

		const updatedQuiz = await QuizService.update(id, updatedData);

		res.status(200).json({message: 'Quiz berhasil diedit', data: updatedQuiz});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const {id} = req.params;

	try {
		const quizId = parseInt(id);

		if (isNaN(quizId)) {
			return res.status(400).json({message: 'ID quiz tidak valid'});
		}

		const deletedCount = await QuizService.delete(quizId);

		if (deletedCount === 0) {
			return res.status(404).json({message: 'Quiz tidak ditemukan'});
		}

		return res.status(200).json({message: 'Quiz berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
