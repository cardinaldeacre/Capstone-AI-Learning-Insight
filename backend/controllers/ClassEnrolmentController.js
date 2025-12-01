const express = require('express');
const router = express.Router();
const ClassEnrolmentService = require('../services/ClassEnrolmentService');
const { authMiddleware, authorizeRole } = require('../middleware/auth');
// buat dashboard
router.get('/my-classes', authMiddleware, async (req, res) => {
	const studentId = req.user.id;

	try {
		const myClasses = await ClassEnrolmentService.getClassesByStudent(studentId);
		return res.status(200).json({ data: myClasses });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server' });
	}
});
// buat teaecher
router.get(
	'/class-students/:classId',
	authMiddleware,
	authorizeRole('admin', 'teacher'),
	async (req, res) => {
		const { classId } = req.params;

		try {
			const students = await ClassEnrolmentService.getStudentsByClass(classId);
			return res.status(200).json({ data: students });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error server' });
		}
	}
);
// cek emrolment (join class/ go to class)
router.get('/check/:classId', authMiddleware, async (req, res) => {
	const { classId } = req.params;
	const studentId = req.user.id;

	try {
		const isEnrolled = await ClassEnrolmentService.isEnrolled(studentId, classId);
		return res.status(200).json({ enrolled: isEnrolled });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server' });
	}
});
// enroll/register class
router.post('/:classId', authMiddleware, async (req, res) => {
	const { classId } = req.params;
	const studentId = req.user.id;

	try {
		const result = await ClassEnrolmentService.enrollStudent(studentId, classId);
		res.status(201).json({ message: 'Berhasil mendaftar ke kelas', data: result });
	} catch (error) {
		if (error.message === 'already_enrolled')
			return res.status(409).json({ message: 'Anda sudah mendaftar di kelas ini' });

		console.error(error);
		res.status(500).json({ message: 'Error server' });
	}
});
// unenroll classs
router.delete('/:classId', authMiddleware, async (req, res) => {
	const { classId } = req.params;
	const studentId = req.user.id;

	try {
		const deletedCount = await ClassEnrolmentService.unenrollStudent(studentId, classId);

		if (deletedCount === 0) {
			return res.status(404).json({ message: 'Anda tidak terdaftar di kelas ini' });
		}

		return res.status(200).json({ message: 'Item berhasil dihapus' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});
// get finsihed class
router.get('/finished-classes', authMiddleware, async (req, res) => {
	const studentId = req.user.id;

	try {
		const finishedClasses = await ClassEnrolmentService.getFinishedClasses(studentId);
		return res.status(200).json({ data: finishedClasses });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server' });
	}
});

module.exports = router;
