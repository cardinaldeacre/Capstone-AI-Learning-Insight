const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRole } = require('../middleware/auth');
const ClassSubmissionService = require('../services/ClassSubmissionService');
const ClassAssignmentService = require('../services/ClassAssignmentService');
const ClassesService = require('../services/ClassesService');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const authorizeGrader = async (req, res, next) => {
	if (req.user.role === 'admin') {
		return next();
	}

	const submissionId = parseInt(req.params.id);
	const submission = await ClassSubmissionService.getById(submissionId);

	if (!submission) {
		return res.status(404).json({ message: 'Submisi tidak ditemukan' });
	}

	const classDetail = await ClassesService.getById(submission.class_id);

	if (!classDetail || classDetail.teacher_id !== req.user.id) {
		return res.status(403).json({ message: 'Anda tidak diizinkan untuk menilai tugas ini.' });
	}

	next();
};

router.get(
	'/assignment/:assignmentId',
	authMiddleware,
	authorizeRole('admin', 'teacher'),
	async (req, res) => {
		const { assignmentId } = req.params;
		try {
			const assignmentIdInt = parseInt(assignmentId);

			if (req.user.role === 'teacher') {
				const assignment = await ClassAssignmentService.getById(assignmentIdInt);
				if (!assignment) {
					return res.status(404).json({ message: 'Tugas tidak ditemukan' });
				}

				const classDetail = await ClassesService.getById(assignment.class_id);

				if (!classDetail || classDetail.teacher_id !== req.user.id) {
					return res.status(403).json({
						message: 'Anda tidak diizinkan melihat submisi untuk tugas kelas ini.',
					});
				}
			}

			const submissions = await ClassSubmissionService.getAllByAssignment(assignmentIdInt);
			return res.status(200).json(submissions);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Error server' });
		}
	}
);

router.get('/student/:assignmentId', authMiddleware, authorizeRole('student'), async (req, res) => {
	const { assignmentId } = req.params;
	const studentId = req.user.id;
	try {
		const assignmentIdInt = parseInt(assignmentId);

		const submission = await ClassSubmissionService.getByAssignmentAndStudent(
			assignmentIdInt,
			studentId
		);

		if (!submission) {
			return res.status(404).json({ message: 'Submisi Anda tidak ditemukan.' });
		}

		return res.status(200).json(submission);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error server' });
	}
});

router.post('/', authMiddleware, authorizeRole('student'), upload.single('file'), async (req, res) => {
	try {
		const { assignment_id } = req.body;
		const studentId = req.user.id;

		if (!req.file) {
			return res.status(400).json({ message: 'File tugas (ZIP/RAR) wajib di upload' });
		}

		if (!assignment_id) {
			return res.status(400).json({ message: 'assignment id haru diisi' })
		}

		const assignmentIdInt = parseInt(assignment_id);
		const fileUrl = `/uploads/submissions/${req.file.filename}`;

		const existing = await ClassSubmissionService.getByAssignmentAndStudent(assignmentIdInt, studentId);
		if (existing) {
			const oldPath = `public${existing.file_url}`;
			if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

			const updated = await ClassSubmissionService.updateFile(existing.id, fileUrl);

			return res.status(200).json({
				message: 'Tugas berhasil di update',
				submission: updated
			})
		}

		const newSubmission = await ClassSubmissionService.create(assignmentIdInt, studentId, fileUrl);

		res.status(201).json({
			message: 'Tugas berhasil disubmit',
			submission: newSubmission,
		});
	} catch (error) {
		if (error.code === '23503')
			return res.status(400).json({ message: 'Assignment ID tidak valid.' });

		console.error(error);
		res.status(500).json({ message: 'Error server' });
	}
});

router.put(
	'/:id/grade',
	authMiddleware,
	authorizeRole('admin', 'teacher'),
	authorizeGrader,
	async (req, res) => {
		const { id } = req.params;
		const { score, feedback } = req.body;

		if (score === undefined || score === null) {
			return res.status(400).json({ message: 'Score harus diisi.' });
		}

		try {
			const submitionId = parseInt(id);

			const updatedData = {
				score,
				feedback: feedback || null,
				status: 'graded',
			};

			const updatedSubmission = await ClassSubmissionService.update(submitionId, updatedData);

			res.status(200).json({
				message: 'Submisi berhasil dinilai',
				submission: updatedSubmission,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error' });
		}
	}
);

router.get('/:assignmentId/download-all', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
	const { assignmentId } = req.params;

	try {
		const submission = await ClassSubmissionService.getAllByAssignment(assignmentId);

		if (submission.length === 0) {
			return res.status(404).json({ message: 'Belum ada tugas yg dikumpulkan' })
		}

		const fileName = `submission-assignment-${assignmentId}.zip`;
		res.attachment(fileName);

		const archive = archiver('zip', {
			zlib: { level: 9 }
		});

		archive.on('error', function (error) {
			console.error("Archiver Error", error);
			res.status(500).send({ message: error.message })
		})

		archive.pipe(res);

		submission.forEach(sub => {
			if (sub.file_url) {
				const relativePath = sub.file_url.startsWith('/') ? sub.file_url.slice(1) : sub.file_url;
				const absolutePath = path.join(__dirname, '../', relativePath);

				if (fs.existsSync(absolutePath)) {
					const niceName = `${sub.student_name.replace(/ /g, '_')}_${sub.id}.zip`;
					archive.file(absolutePath, { name: niceName });
				}
			}
		})

		await archive.finalize()
	} catch (error) {
		console.error(error);
		if (!res.headersSent) {
			res.status(500).json({ message: 'Gagal membuat zip.' });
		}
	}
})

router.delete('/:id', authMiddleware, async (req, res) => {
	const { id } = req.params;
	const userId = req.user.id;
	const userRole = req.user.role;

	try {
		const submissionId = parseInt(id);
		const submission = await ClassSubmissionService.getById(submissionId);

		if (!submission) {
			return res.status(404).json({ message: 'Submisi tidak ditemukan' });
		}

		if (userRole === 'student' && submission.student_id !== userId) {
			return res.status(403).json({ message: 'Anda hanya boleh menghapus submisi milik sendiri.' });
		}

		if (submission.file_url) {
			const cleanUrl = submission.file_url.startsWith('/') ? submission.file_url : '/' + submission.file_url;
			const filePath = path.join(process.cwd(), 'public', cleanUrl);

			if (fs.existsSync(filePath)) {
				try {
					fs.unlinkSync(filePath);
					console.log(`Deleted file: ${filePath}`);
				} catch (err) {
					console.error("Gagal menghapus file,", err);
				}
			}
		}

		await ClassSubmissionService.delete(submissionId);
		return res.status(200).json({ message: 'Submisi dan file berhasil dihapus' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
})

module.exports = router;
