const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth'); // Sesuaikan path
const ClassAssignmentService = require('../services/ClassAssignmentService'); // Sesuaikan path
const ClassesService = require('../services/ClassesService'); // Digunakan untuk memverifikasi kepemilikan kelas

// Middleware helper untuk otorisasi tugas: Memastikan Guru memiliki Class yang terkait dengan Assignment
const authorizeAssignmentOwner = async (req, res, next) => {
    // Admin bypass (sudah dicek oleh authorizeRole)
    if (req.user.role === 'admin') {
        return next();
    }

    const assignmentId = parseInt(req.params.id);
    const classId = await ClassAssignmentService.getClassIdByAssignmentId(assignmentId);

    if (!classId) {
        return res.status(404).json({message: 'Tugas tidak ditemukan'});
    }

    // Cek apakah user adalah teacher dari kelas ini
    const classDetail = await ClassesService.getById(classId);

    // Jika kelas tidak ditemukan atau teacher_id tidak cocok
    if (!classDetail || classDetail.teacher_id !== req.user.id) {
        return res.status(403).json({message: 'Anda tidak diizinkan untuk memodifikasi tugas ini.'});
    }

    next();
};

// --- Get All Assignments for a specific Class ---
// Route: /assignments/class/:classId
router.get('/class/:classId', authMiddleware, async (req, res) => {
    const { classId } = req.params;
    try {
        const classIdInt = parseInt(classId);
        
        // TODO Otorisasi: Verifikasi bahwa user adalah Admin, Teacher kelas, atau Student yang terdaftar di kelas tsb.

        const assignments = await ClassAssignmentService.getAll(classIdInt);
        
        return res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});

// --- Get Assignment by ID ---
// Route: /assignments/:id
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const assignmentId = parseInt(id);
        const assignment = await ClassAssignmentService.getById(assignmentId);
        
        if (!assignment) {
            return res.status(404).json({message: 'Tugas tidak ditemukan'});
        }

        // TODO Otorisasi: Verifikasi bahwa user adalah Admin, Teacher kelas, atau Student yang terdaftar di kelas tsb.
        
        return res.status(200).json(assignment);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});


// --- Create New Assignment ---
// Route: /assignments
router.post('/', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
    try {
        const { class_id, title, content, min_score } = req.body;

        if (!class_id || !title || !content) {
            return res.status(400).json({message: 'class_id, title, dan content harus diisi.'});
        }
        
        const classIdInt = parseInt(class_id);
        
        // Verifikasi Otorisasi: Pastikan Teacher yang membuat tugas adalah pemilik kelas
        if (req.user.role === 'teacher') {
            const classDetail = await ClassesService.getById(classIdInt);
            // Tolak jika kelas tidak ada atau guru yang login bukan pemiliknya
            if (!classDetail || classDetail.teacher_id !== req.user.id) {
                 return res.status(403).json({message: 'Anda tidak diizinkan membuat tugas untuk kelas ini.'});
            }
        }
        
        const data = { class_id: classIdInt, title, content, min_score };
        const newAssignment = await ClassAssignmentService.create(data);

        res.status(201).json({message: 'Tugas berhasil dibuat', assignment: newAssignment});
    } catch (error) {
        console.error(error);
        // Error FK violation (class_id tidak ada)
        if (error.code === '23503') return res.status(400).json({message: 'Class ID tidak valid.'});
        res.status(500).json({message: 'Error server'});
    }
});

// --- Update Assignment ---
// Route: /assignments/:id
router.put('/:id', authMiddleware, authorizeRole('admin', 'teacher'), authorizeAssignmentOwner, async (req, res) => {
    const {id} = req.params;
    const { title, content, min_score } = req.body;
    const updatedData = {};

    if (title) updatedData.title = title;
    if (content) updatedData.content = content;
    if (min_score !== undefined && min_score !== null) updatedData.min_score = min_score;


    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
    }

    try {
        const itemId = parseInt(id);
        
        // Otorisasi sudah ditangani oleh authorizeAssignmentOwner
        const updateItem = await ClassAssignmentService.update(itemId, updatedData);

        res.status(200).json({message: 'Tugas berhasil diedit', item: updateItem});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

// --- Delete Assignment ---
// Route: /assignments/:id
router.delete('/:id', authMiddleware, authorizeRole('admin', 'teacher'), authorizeAssignmentOwner, async (req, res) => {
    const { id } = req.params;

    try {
        const itemId = parseInt(id);

        if (isNaN(itemId)) {
            return res.status(400).json({message: 'ID tugas tidak valid'});
        }
        
        // Otorisasi sudah ditangani oleh authorizeAssignmentOwner
        const deletedCount = await ClassAssignmentService.delete(itemId);

        if (deletedCount === 0) {
            // Seharusnya tidak tercapai
            return res.status(404).json({message: 'Tugas tidak ditemukan'});
        }
            
        return res.status(200).json({message: 'Tugas berhasil dihapus'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;