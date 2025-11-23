const express = require('express');
const router = express.Router();
const ClassesController = require('../controllers/ClassesController'); // Sesuaikan path
const { authMiddleware, authorizeRole } = require('../middleware/auth'); // Import dari file auth.js kamu tadi

// 1. CREATE: Bikin Kelas (Hanya Admin & Teacher)
router.post(
  '/', 
  authMiddleware, 
  authorizeRole('admin', 'teacher'), // <--- Gemboknya disini
  ClassesController.createClass
);

// 2. READ ALL: Lihat Semua Kelas (Semua role yang login boleh lihat)
router.get(
  '/', 
  authMiddleware, 
  authorizeRole('admin', 'teacher', 'student'), 
  ClassesController.getAllClasses
);

// 3. READ ONE: Lihat Detail 1 Kelas (Semua role boleh lihat)
router.get(
  '/:id', 
  authMiddleware, 
  authorizeRole('admin', 'teacher', 'student'), 
  ClassesController.getClassById
);

// 4. UPDATE: Edit Kelas (Hanya Admin & Teacher)
router.put(
  '/:id', 
  authMiddleware, 
  authorizeRole('admin', 'teacher'), 
  ClassesController.updateClass
);

// 5. DELETE: Hapus Kelas (Hanya Admin & Teacher)
router.delete(
  '/:id', 
  authMiddleware, 
  authorizeRole('admin', 'teacher'), 
  ClassesController.deleteClass
);

module.exports = router;