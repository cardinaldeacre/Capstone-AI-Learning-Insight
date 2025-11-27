/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Manajemen Kuis (Judul, Timer, Min Score)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         module_id:
 *           type: integer
 *         title:
 *           type: string
 *         timer:
 *           type: integer
 *           description: Durasi dalam menit/detik (sesuai kesepakatan)
 *         min_score:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         module_id: 10
 *         title: "Kuis Harian React Basic"
 *         timer: 30
 *         min_score: 75
 *
 *     QuizInput:
 *       type: object
 *       required:
 *         - module_id
 *         - title
 *         - timer
 *       properties:
 *         module_id:
 *           type: integer
 *         title:
 *           type: string
 *         timer:
 *           type: integer
 *           description: Durasi pengerjaan
 *         min_score:
 *           type: integer
 *           description: Nilai minimal kelulusan (opsional)
 */

/**
 * @swagger
 * /api/quizzes/module/{moduleId}:
 *   get:
 *     summary: Ambil daftar kuis berdasarkan Module ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Modul
 *     responses:
 *       200:
 *         description: Data kuis berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Ambil detail satu kuis
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Kuis
 *     responses:
 *       200:
 *         description: Detail kuis ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Buat kuis baru (Teacher/Admin)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       201:
 *         description: Quiz berhasil dibuat
 *       400:
 *         description: Data tidak lengkap
 *       403:
 *         description: Akses ditolak
 */

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     summary: Update kuis (Teacher/Admin)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               timer:
 *                 type: integer
 *               min_score:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Quiz berhasil diedit
 *       404:
 *         description: Quiz tidak ditemukan
 */

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     summary: Hapus kuis (Teacher/Admin)
 *     tags: [Quizzes]
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
 *         description: Quiz berhasil dihapus
 *       404:
 *         description: Quiz tidak ditemukan
 */
