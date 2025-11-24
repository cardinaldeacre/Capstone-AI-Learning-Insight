const express = require('express');
const router = express.Router();
const ModulesService = require('../services/ModulesService');
const {authMiddleware, authorizeRole} = require('../middleware/auth');

router.get('/class/:classId', authMiddleware, async (req, res) => {
	const {classId} = req.params;

	try {
		const modules = await ModulesService.getByClassId(classId);
		return res.status(200).json(modules);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/:id', authMiddleware, async (req, res) => {
	const {id} = req.params;

	try {
		const module = await ModulesService.getById(id);
		if (!module === null) {
			return res.status(404).json({message: 'Module tidak ditemukan'});
		}

		return res.status(200).json(module);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {title, content, order_number, class_id} = req.body;

	if (!class_id || !title || !content || order_number === null) {
		return res
			.status(400)
			.json({message: 'class_id, title, content, dan order_number harus diisi'});
	}

	try {
		const payload = await ModulesService.create({
			title,
			content,
			order_number,
			class_id,
		});

		res.status(201).json({message: 'Module berhasil dibuat', data: payload});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.put('/:id', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {id} = req.params;
	const updatedData = req.body;

	if (Object.keys(updatedData).length === 0) {
		return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
	}

	try {
		const itemId = parseInt(id);

		const updateItem = await ModulesService.update(itemId, updatedData);

		if (!updateItem) {
			return res.status(404).json({message: 'Module tidak ditemukan'});
		}

		res.status(200).json({message: 'Module berhasil diedit', item: updateItem});
	} catch (error) {
		if (error.code === '23505') {
			return res.status(409).json({message: 'Module sudah dibuat.'});
		}

		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', authMiddleware, authorizeRole('teacher', 'admin'), async (req, res) => {
	const {id} = req.params;

	try {
		const itemId = parseInt(id);

		if (isNaN(itemId)) {
			return res.status(400).json({message: 'ID Module tidak valid'});
		}

		const deletedCount = await ModulesService.delete(itemId);

		if (deletedCount === 0) {
			return res.status(404).json({message: 'Module tidak ditemukan'});
		}

		return res.status(200).json({message: 'Module berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
