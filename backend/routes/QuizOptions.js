/**
 * @swagger
 * tags:
 *   name: Quiz Options
 *   description: Manajemen Opsi Jawaban (A, B, C, D)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizOption:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         question_id:
 *           type: integer
 *         option_text:
 *           type: string
 *         is_correct:
 *           type: boolean
 *           description: Hanya terlihat oleh Admin/Teacher
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         question_id: 10
 *         option_text: "Jakarta"
 *         is_correct: true
 *
 *     QuizOptionInput:
 *       type: object
 *       required:
 *         - question_id
 *         - option_text
 *       properties:
 *         question_id:
 *           type: integer
 *         option_text:
 *           type: string
 *         is_correct:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * /api/quiz-options/question/{questionId}:
 *   get:
 *     summary: Ambil semua opsi jawaban untuk satu pertanyaan
 *     description: Jika user adalah student, field is_correct akan disembunyikan.
 *     tags: [Quiz Options]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Pertanyaan
 *     responses:
 *       200:
 *         description: Data opsi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizOption'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quiz-options:
 *   post:
 *     summary: Tambah opsi jawaban baru (Teacher/Admin)
 *     tags: [Quiz Options]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizOptionInput'
 *     responses:
 *       201:
 *         description: Opsi berhasil dibuat
 *       400:
 *         description: Data tidak lengkap
 *       403:
 *         description: Akses ditolak
 */

/**
 * @swagger
 * /api/quiz-options/{id}:
 *   put:
 *     summary: Update opsi jawaban (Teacher/Admin)
 *     tags: [Quiz Options]
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
 *               option_text:
 *                 type: string
 *               is_correct:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Opsi berhasil diedit
 *       404:
 *         description: Opsi tidak ditemukan
 */

/**
 * @swagger
 * /api/quiz-options/{id}:
 *   delete:
 *     summary: Hapus opsi jawaban (Teacher/Admin)
 *     tags: [Quiz Options]
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
 *         description: Opsi berhasil dihapus
 *       404:
 *         description: Opsi tidak ditemukan
 */
