/**
 * @swagger
 * tags:
 *   name: Class Assignments
 *   description: Manajemen Tugas Kelas (Instruksi Tugas)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassAssignment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         class_id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *           description: Isi instruksi tugas
 *         min_score:
 *           type: integer
 *           nullable: true
 *           description: Nilai minimal (KKM)
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         class_id: 10
 *         title: Essay Sejarah
 *         content: Buatlah essay tentang...
 *         min_score: 75
 *
 *     ClassAssignmentInput:
 *       type: object
 *       required:
 *         - class_id
 *         - title
 *         - content
 *       properties:
 *         class_id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         min_score:
 *           type: integer
 *           nullable: true
 */

/**
 * @swagger
 * /api/assignments/class/{classId}:
 *   get:
 *     summary: Ambil semua tugas dalam kelas
 *     tags: [Class Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Kelas
 *     responses:
 *       200:
 *         description: List tugas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClassAssignment'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Ambil detail satu tugas
 *     tags: [Class Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Tugas
 *     responses:
 *       200:
 *         description: Detail tugas ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassAssignment'
 *       404:
 *         description: Tugas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Buat tugas baru (Teacher/Admin)
 *     tags: [Class Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassAssignmentInput'
 *     responses:
 *       201:
 *         description: Tugas berhasil dibuat
 *       400:
 *         description: Data tidak lengkap atau Class ID salah
 *       403:
 *         description: Akses ditolak (Bukan pemilik kelas)
 */

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     summary: Update tugas (Owner/Admin)
 *     tags: [Class Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               min_score:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tugas berhasil diedit
 *       400:
 *         description: Data kosong
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: Tugas tidak ditemukan
 */

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     summary: Hapus tugas (Owner/Admin)
 *     tags: [Class Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tugas berhasil dihapus
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: Tugas tidak ditemukan
 */
