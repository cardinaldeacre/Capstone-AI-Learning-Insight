const express = require('express');
const router = express.Router();
const {authMiddleware, authorizeRole} = require('../middleware/auth'); // Sesuaikan path
const ClassesService = require('../services/ClassesService'); // Sesuaikan path

// --- Get All Classes ---
/**
 * Mendapatkan daftar kelas.
 * - Admin: Semua kelas
 * - Teacher: Kelas yang dia ajar
 * - Student: Kelas yang dia enrol
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Asumsi req.user diisi oleh authMiddleware
        const { role, id: userId } = req.user; 
        
        // Panggil service dengan role dan userId untuk filtering
        const classes = await ClassesService.getAll(role, userId);
        
        return res.status(200).json(classes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});

// --- Get Class By ID (Tambahan untuk Detail Kelas) ---
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const classId = parseInt(id);
        if (isNaN(classId)) {
            return res.status(400).json({message: 'ID kelas tidak valid'});
        }

        const classDetail = await ClassesService.getById(classId);

        if (!classDetail) {
            return res.status(404).json({message: 'Kelas tidak ditemukan'});
        }

        // TODO: Tambahkan otorisasi di sini jika siswa/guru hanya boleh melihat kelas tertentu
        // Untuk saat ini, biarkan semua user terautentikasi bisa melihat detail.
        
        return res.status(200).json(classDetail);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: 'Error server'});
    }
});

// --- Create New Class ---
/**
 * Membuat kelas baru (Hanya Admin & Teacher).
 */
router.post('/', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
    try {
        const { title, description } = req.body;
        // Teacher ID diambil dari user yang sedang login
        const teacher_id = req.user.id; 

        if (!title || !description) {
            return res.status(400).json({message: 'Title dan description harus diisi.'});
        }

        const newClass = await ClassesService.create({ title, description, teacher_id });

        res.status(201).json({message: 'Kelas berhasil dibuat', class: newClass});
    } catch (error) {
        // Asumsi error kode '23505' adalah dari database (misal: UNIQUE constraint)
        if (error.code === '23505') return res.status(409).json({message: 'Judul kelas sudah digunakan.'});
 
        console.error(error);
        res.status(500).json({message: 'Error server'});
    }
});

// --- Update Class ---
/**
 * Memperbarui kelas (Hanya Admin, atau Teacher pemilik kelas).
 */
router.put('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
    const {id} = req.params;
    const { title, description } = req.body;
    const updatedData = {};

    if (title) updatedData.title = title;
    if (description) updatedData.description = description;

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
    }

    try {
        const itemId = parseInt(id);
        
        // 1. Cek keberadaan kelas dan otorisasi
        const existingClass = await ClassesService.getById(itemId);

        if (!existingClass) {
            return res.status(404).json({message: 'Kelas tidak ditemukan'});
        }
        
        // Cek otorisasi: Jika bukan admin DAN bukan guru dari kelas ini, tolak
        if (req.user.role !== 'admin' && existingClass.teacher_id !== req.user.id) {
            return res.status(403).json({message: 'Anda tidak diizinkan untuk mengedit kelas ini'});
        }

        // 2. Lakukan update
        const updateItem = await ClassesService.update(itemId, updatedData);

        res.status(200).json({message: 'Kelas berhasil diedit', item: updateItem});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({message: 'Judul kelas sudah digunakan.'});
        }

        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

// --- Delete Class ---
/**
 * Menghapus kelas (Hanya Admin, atau Teacher pemilik kelas).
 */
router.delete('/:id', authMiddleware, authorizeRole('admin', 'teacher'), async (req, res) => {
    const { id } = req.params;

    try {
        const itemId = parseInt(id);

        if (isNaN(itemId)) {
            return res.status(400).json({message: 'ID kelas tidak valid'});
        }
        
        // 1. Cek keberadaan kelas dan otorisasi
        const existingClass = await ClassesService.getById(itemId);

        if (!existingClass) {
            return res.status(404).json({message: 'Kelas tidak ditemukan'});
        }

        // Cek otorisasi: Jika bukan admin DAN bukan guru dari kelas ini, tolak
        if (req.user.role !== 'admin' && existingClass.teacher_id !== req.user.id) {
            return res.status(403).json({message: 'Anda tidak diizinkan untuk menghapus kelas ini'});
        }

        // 2. Lakukan delete
        const deletedCount = await ClassesService.delete(itemId);

        // deletedCount pasti 1 jika sudah lolos cek existingClass
        return res.status(200).json({message: 'Kelas berhasil dihapus'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

// --- Enrolment: Register Student to Class ---
/**
 * Siswa mendaftar ke kelas.
 */
router.post('/:id/enrol', authMiddleware, authorizeRole('student'), async (req, res) => {
    const { id } = req.params; // Class ID
    const studentId = req.user.id; // Student ID dari token

    try {
        const classId = parseInt(id);

        // Cek apakah kelas ada
        const existingClass = await ClassesService.getById(classId);
        if (!existingClass) {
            return res.status(404).json({message: 'Kelas tidak ditemukan'});
        }

        // Panggil fungsi enrolment dari service
        const enrolment = await ClassesService.enrolStudent(classId, studentId);

        return res.status(201).json({
            message: 'Berhasil mendaftar ke kelas',
            enrolment: enrolment
        });
    } catch (error) {
        // Error kode '23505' untuk pelanggaran UNIQUE constraint (sudah terdaftar)
        if (error.code === '23505') {
            return res.status(409).json({message: 'Anda sudah terdaftar di kelas ini.'});
        }
        
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;