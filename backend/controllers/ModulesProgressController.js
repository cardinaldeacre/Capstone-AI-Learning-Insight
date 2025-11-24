const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth');
const ModulesProgressService = require('../services/ModulesProgressService');

router.get('/class/:classId', authMiddleware, async (req, res) => {
	const {classId} = req.params;
	const studentId = req.user.id;

	try {
		const progressData = await ModulesProgressService.getProgressByClass(studentId, classId);

		const totalModules = progressData.length;
		const completedModules = progressData.filter(m => m.completed_at !== null).length;
		const percentageCompleted =
			totalModules === 0 ? 0 : Math.round(completedModules / totalModules * 100);

		return res.status(200).json({
			message: 'Data berhasil diambil',
			stats: {
				total: totalModules,
				completed: completedModules,
				percentage: percentageCompleted,
			},
			data: progressData,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.post('/:moduleId/start', authMiddleware, async (req, res) => {
	const {moduleId} = req.params;
	const studentId = req.user.id;

	try {
		const record = await ModulesProgressService.markStarted(studentId, moduleId);
		res.status(200).json({message: 'Modul dimulai ', data: record});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

router.put('/:moduleId/complete', authMiddleware, async (req, res) => {
	const {moduleId} = req.params;
	const studentId = req.user.id;

	try {
		const result = await ModulesProgressService.markCompleted(studentId, moduleId);

		if (!result) {
			return res.status(404).json({message: 'Progress modul tidak ditemukan'});
		}

		res.status(200).json({message: 'Modul ditandai selesai', data: result});
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Server error'});
	}
});

module.exports = router;
