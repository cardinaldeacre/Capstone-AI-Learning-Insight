const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const ClassAssignmentService = require('../services/ClassAssignmentService');
const ClassesService = require('../services/ClassesService');

const authorizeAssignmentOwner = async (req, res, next) => {
	if (req.user.role === 'admin') {
		return next();
	}

	const assignmentId = parseInt(req.params.id);
	const assignment = await ClassAssignmentService.getById(assignmentId);

	if (!assignment) {
		return res.status(404).json({message: 'Tugas tidak ditemukan'});
	}

	const classDetail = await ClassesService.getById(assignment.class_id);

	if (!classDetail || classDetail.teacher_id !== req.user.id) {
		return res.status(403).json({message: 'Anda tidak diizinkan untuk memodifikasi tugas ini.'});
	}

	next();
};

router.get('/class/:classId', authMiddleware, async (req, res) => {
	const {classId} = req.params;
	try {
		const classIdInt = parseInt(classId);
		const assignments = await ClassAssignmentService.getByClassId(classIdInt);

		return res.status(200).json(assignments);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.get('/:id', authMiddleware, async (req, res) => {
	const {id} = req.params;
	try {
		const assignmentId = parseInt(id);
		const assignment = await ClassAssignmentService.getById(assignmentId);

		if (!assignment) {
			return res.status(404).json({message: 'Tugas tidak ditemukan'});
		}

		return res.status(200).json(assignment);
	} catch (error) {
		console.error(error);
		return res.status(500).json({message: 'Error server'});
	}
});

router.post('/', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	try {
		const {class_id, title, content, min_score} = req.body;

		if (!class_id || !title || !content) {
			return res.status(400).json({message: 'class_id, title, dan content harus diisi.'});
		}

		const classIdInt = parseInt(class_id);

		if (req.user.role === 'teacher') {
			const classDetail = await ClassesService.getById(classIdInt);
			if (!classDetail || classDetail.teacher_id !== req.user.id) {
				return res
					.status(403)
					.json({message: 'Anda tidak diizinkan membuat tugas untuk kelas ini.'});
			}
		}

		const data = {class_id: classIdInt, title, content, min_score};
		const newAssignment = await ClassAssignmentService.create(data);

		res.status(201).json({message: 'Tugas berhasil dibuat', assignment: newAssignment});
	} catch (error) {
		console.error(error);
		if (error.code === '23503') return res.status(400).json({message: 'Class ID tidak valid.'});
		res.status(500).json({message: 'Error server'});
	}
});

router.put(
	'/:id',
	authMiddleware,
	authorizeRole('admin', 'teacher'),
	authorizeAssignmentOwner,
	async (req, res) => {
		const {id} = req.params;
		const {title, content, min_score} = req.body;
		const updatedData = {};

		if (title) updatedData.title = title;
		if (content) updatedData.content = content;
		if (min_score !== undefined && min_score !== null) updatedData.min_score = min_score;

		if (Object.keys(updatedData).length === 0) {
			return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
		}

		try {
			const assignmentId = parseInt(id);

			const updateItem = await ClassAssignmentService.update(assignmentId, updatedData);

			res.status(200).json({message: 'Tugas berhasil diedit', item: updateItem});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	}
);

router.delete(
	'/:id',
	authMiddleware,
	authorizeRole('admin', 'teacher'),
	authorizeAssignmentOwner,
	async (req, res) => {
		const {id} = req.params;

		try {
			const assignmentId = parseInt(id);

			if (isNaN(assignmentId)) {
				return res.status(400).json({message: 'ID tugas tidak valid'});
			}

			const deletedCount = await ClassAssignmentService.delete(assignmentId);

			if (deletedCount === 0) {
				return res.status(404).json({message: 'Tugas tidak ditemukan'});
			}

			return res.status(200).json({message: 'Tugas berhasil dihapus'});
		} catch (error) {
			console.error(error);
			res.status(500).json({message: 'Server error'});
		}
	}
);

module.exports = router;
