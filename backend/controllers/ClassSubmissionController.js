const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth'); 
const ClassSubmissionService = require('../services/ClassSubmissionService');
const ClassAssignmentService = require('../services/ClassAssignmentService'); 
const ClassesService = require('../services/ClassesService');

// Middleware helper untuk otorisasi grading: Memastikan Teacher/Admin memiliki Class yang terkait
const authorizeGrader = async (req, res, next) => {
    // Admin bypass (sudah dicek oleh authorizeRole)
    if (req.user.role === 'admin') {
        return next();
    }
    
    // Asumsi: Request adalah untuk grading (PUT /submissions/:id)
    const submissionId = parseInt(req.params.id);
    const submission = await ClassSubmissionService.getById(submissionId);

    if (!submission) {
        return res.status(404).json({message: 'Submisi tidak ditemukan'});
    }
    
    const classDetail = await ClassesService.getById(submission.class_id);

    // Cek otorisasi: Guru harus pemilik kelas
    if (!classDetail || classDetail.teacher_id !== req.user.id) {
        return res.status(403).json({message: 'Anda tidak diizinkan untuk menilai tugas ini.'});
    }

    next();
};

// --- Get All Submissions by Assignment ID (Teacher/Admin view) ---
// Route: /submissions/assignment/:assignmentId
router.get('/assignment/:assignmentId', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
    const { assignmentId } = req.params;
    try {
        const assignmentIdInt = parseInt(assignmentId);
        
        // Otorisasi: Verifikasi bahwa Teacher adalah pemilik kelas
        if (req.user.role === 'teacher') {
            const classId = await ClassAssignmentService.getClassIdByAssignmentId(assignmentIdInt);
            const classDetail = await ClassesService.getById(classId);

            if (!classDetail || classDetail.teacher_id !== req.user.id) {
                 return res.status(403).json({message: 'Anda tidak diizinkan melihat submisi untuk tugas kelas ini.'});
            }
        }
        
        const submissions = await ClassSubmissionService.getAllByAssignment(assignmentIdInt);
        return res.status(200).json(submissions);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});

// --- Get Student's Submission for an Assignment (Student view) ---
// Route: /submissions/student/:assignmentId
router.get('/student/:assignmentId', authMiddleware, authorizeRole('student'), async (req, res) => {
    const { assignmentId } = req.params;
    const studentId = req.user.id;
    try {
        const assignmentIdInt = parseInt(assignmentId);
        
        const submission = await ClassSubmissionService.getByAssignmentAndStudent(assignmentIdInt, studentId);
        
        if (!submission) {
            return res.status(404).json({message: 'Submisi Anda tidak ditemukan.'});
        }
        
        return res.status(200).json(submission);

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});

// --- Submit Assignment (Create Submission) ---
// Route: /submissions
router.post('/', authMiddleware, authorizeRole('student'), async (req, res) => {
    try {
        const { assignment_id } = req.body;
        const studentId = req.user.id; 

        if (!assignment_id) {
            return res.status(400).json({message: 'assignment_id harus diisi.'});
        }
        
        const assignmentIdInt = parseInt(assignment_id);
        
        // TODO: Cek juga apakah siswa terdaftar di kelas yang memiliki assignment ini.
        
        const newSubmission = await ClassSubmissionService.create(assignmentIdInt, studentId);

        res.status(201).json({message: 'Tugas berhasil disubmit', submission: newSubmission});
    } catch (error) {
        // Tangani custom error dari service (Submission already exists)
        if (error.code === '409') {
             return res.status(409).json({message: 'Anda sudah mensubmit tugas ini.'});
        }
        // Error FK violation (assignment_id tidak ada)
        if (error.code === '23503') return res.status(400).json({message: 'Assignment ID tidak valid.'});
 
        console.error(error);
        res.status(500).json({message: 'Error server'});
    }
});

// --- Grading (Memberi Nilai) ---
// Route: PUT /submissions/:id/grade
router.put('/:id/grade', authMiddleware, authorizeRole('admin', 'teacher'), authorizeGrader, async (req, res) => {
    const {id} = req.params;
    const { score, feedback } = req.body;
    
    if (score === undefined || score === null) {
        return res.status(400).json({message: 'Score harus diisi.'});
    }

    try {
        const itemId = parseInt(id);
        
        const updatedData = {
            score, 
            feedback: feedback || null,
            status: 'graded' // Set status menjadi 'graded'
        };

        const updatedSubmission = await ClassSubmissionService.update(itemId, updatedData);

        res.status(200).json({message: 'Submisi berhasil dinilai', submission: updatedSubmission});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;