const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const ClassesService = require('../services/ClassesService');

router.get('/', authMiddleware, async (req, res) => {
	try {
		const classes = await ClassesService.getAll();
		return res.status(200).json(classes);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/student', authMiddleware, async (req, res) => {
	try {
		const {role, id: userId} = req.user;
		const classes = await ClassesService.getClassesByStudent(role, userId);

		return res.status(200).json(classes);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/:id', authMiddleware, async (req, res) => {
	const {id} = req.params;
	try {
		const classId = parseInt(id);
		if (isNaN(classId)) {
			return res.status(400).json({message: 'ID kelas tidak valid'});
		}

		const classDetail = await ClassesService.getById(classId);
		if (!classDetail) {
			return res.status(404).json({message: 'Kelas tidak ditemukan'});
		}

		return res.status(200).json(classDetail);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	try {
		const {title, description} = req.body;
		const teacher_id = req.user.id || req.body.teacher_id;

		if (!title || !description) {
			return res.status(400).json({message: 'Title dan description harus diisi.'});
		}

		const newClass = await ClassesService.create({title, description, teacher_id});

		res.status(201).json({message: 'Kelas berhasil dibuat', class: newClass});
	} catch (error) {
		if (error.code === '23505')
			return res.status(409).json({message: 'Judul kelas sudah digunakan.'});

		console.error(error);
		res.status(500).json({message: 'Error server'});
	}
});

router.put('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const {id} = req.params;
	const {title, description} = req.body;
	const updatedData = {};

	if (title) updatedData.title = title;
	if (description) updatedData.description = description;

	if (Object.keys(updatedData).length === 0) {
		return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
	}

	try {
		const classId = parseInt(id);
		const existingClass = await ClassesService.getById(classId);

		if (!existingClass) {
			return res.status(404).json({message: 'Kelas tidak ditemukan'});
		}

		const updateClass = await ClassesService.update(classId, updatedData);

		res.status(200).json({message: 'Kelas berhasil diedit', data: updateClass});
	} catch (error) {
		if (error.code === '23505') {
			return res.status(409).json({message: 'Judul kelas sudah digunakan.'});
		}

		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.delete('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const {id} = req.params;

	try {
		const classId = parseInt(id);

		if (isNaN(classId)) {
			return res.status(400).json({message: 'ID kelas tidak valid'});
		}

		const deletedCount = await ClassesService.delete(classId);
		if (deletedCount === 0) {
			return res.status(404).json({message: 'Kelas tidak ditemukan'});
		}

		return res.status(200).json({message: 'Kelas berhasil dihapus'});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
