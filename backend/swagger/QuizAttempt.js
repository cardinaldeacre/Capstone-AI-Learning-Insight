/**
 * @swagger
 * tags:
 *   name: Quiz Attempts
 *   description: Pengerjaan & Penilaian Kuis (Siswa)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     QuizAnswerItem:
 *       type: object
 *       required:
 *         - question_id
 *         - option_id
 *       properties:
 *         question_id:
 *           type: integer
 *           description: ID Pertanyaan
 *         option_id:
 *           type: integer
 *           description: ID Opsi jawaban yang dipilih
 *
 *     QuizSubmission:
 *       type: object
 *       required:
 *         - quiz_id
 *         - userAnswer
 *       properties:
 *         quiz_id:
 *           type: integer
 *         userAnswer:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/QuizAnswerItem'
 *
 *     QuizResult:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         score:
 *           type: number
 *           format: float
 *         is_passed:
 *           type: boolean
 *         min_score:
 *           type: integer
 */

/**
 * @swagger
 * /api/quiz-attempts/history/{quizId}:
 *   get:
 *     summary: Lihat riwayat nilai siswa pada kuis tertentu
 *     tags: [Quiz Attempts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Kuis
 *     responses:
 *       200:
 *         description: Riwayat berhasil diambil
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/quiz-attempts:
 *   post:
 *     summary: Submit jawaban kuis (Auto-grading)
 *     tags: [Quiz Attempts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizSubmission'
 *     responses:
 *       201:
 *         description: Kuis berhasil disubmit dan dinilai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/QuizResult'
 *       400:
 *         description: Data tidak lengkap
 *       500:
 *         description: Server error
 */
