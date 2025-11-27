const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const QuizOptionService = require('../services/QuizOptionService');

router.get('/question/:questionId', async (req, res) => {
	const {questionId} = req.params;

	try {
		const options = await QuizOptionService.getByQustionId(questionId);
		const safeOptions =
			req.user.role === 'student' ? options.map(({is_correct, ...rest}) => rest) : options;

		return res.status(200).json({data: safeOptions});
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {question_id, option_text, is_correct} = req.body;

	if (!question_id || !option_text) {
		return res.status(400).json({message: 'Question ID & teks opsi wajib diisi'});
	}

	try {
		const newOption = await QuizOptionService.create({
			question_id,
			option_text,
			is_correct: is_correct || false,
		});

		res.status(201).json({message: 'Opsi jawaban berhasil ditambahkaan', data: newOption});
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
		const OptionId = parseInt(id);

		const updateOpsi = await QuizOptionService.update(OptionId, updatedData);

		if (!updateOpsi) {
			return res.status(404).json({message: 'Opsi tidak ditemukan'});
		}

		res.status(200).json({message: 'Opsi berhasil diedit', data: updateOpsi});
	} catch (error) {
		if (error.code === '23505') {
			return res.status(409).json({message: 'item sudah digunakan.'});
		}

		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const {id} = req.params;

	try {
		const OptionId = parseInt(id);

		if (isNaN(OptionId)) {
			return res.status(400).json({message: 'ID opsi tidak valid'});
		}

		const deletedCount = await QuizOptionService.delete(OptionId);

		if (deletedCount === 0) {
			return res.status(404).json({message: 'Opsi tidak ditemukan'});
		}

		return res.status(200).json({message: 'Opsi berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
