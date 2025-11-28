/**
 * @swagger
 * tags:
 *   name: Class Submissions
 *   description: Pengumpulan & Penilaian Tugas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ClassSubmission:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         assignment_id:
 *           type: integer
 *         student_id:
 *           type: integer
 *         class_id:
 *           type: integer
 *         started_at:
 *           type: string
 *           format: date-time
 *         submitted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [not_started, in_progress, submitted, graded]
 *         score:
 *           type: number
 *           format: float
 *           nullable: true
 *         feedback:
 *           type: string
 *           nullable: true
 *       example:
 *         id: 1
 *         assignment_id: 10
 *         student_id: 5
 *         status: submitted
 *         score: null
 *         feedback: null
 *
 *     SubmissionInput:
 *       type: object
 *       required:
 *         - assignment_id
 *       properties:
 *         assignment_id:
 *           type: integer
 *
 *     GradingInput:
 *       type: object
 *       required:
 *         - score
 *       properties:
 *         score:
 *           type: number
 *           description: Nilai (0-100)
 *         feedback:
 *           type: string
 *           description: Masukan untuk siswa
 */

/**
 * @swagger
 * /api/submissions/assignment/{assignmentId}:
 *   get:
 *     summary: Ambil semua submisi siswa untuk tugas tertentu (Teacher/Admin)
 *     tags: [Class Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List submisi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ClassSubmission'
 *       403:
 *         description: Akses ditolak (Bukan guru pemilik kelas)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/submissions/student/{assignmentId}:
 *   get:
 *     summary: Ambil submisi saya sendiri (Student)
 *     tags: [Class Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Submisi ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassSubmission'
 *       404:
 *         description: Submisi belum ada / tidak ditemukan
 */

/**
 * @swagger
 * /api/submissions:
 *   post:
 *     summary: Submit Tugas (Student)
 *     tags: [Class Submissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubmissionInput'
 *     responses:
 *       201:
 *         description: Tugas berhasil disubmit
 *       409:
 *         description: Anda sudah mensubmit tugas ini
 *       400:
 *         description: Data tidak lengkap
 */

/**
 * @swagger
 * /api/submissions/{id}/grade:
 *   put:
 *     summary: Beri Nilai Tugas (Teacher/Admin)
 *     tags: [Class Submissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Submisi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradingInput'
 *     responses:
 *       200:
 *         description: Submisi berhasil dinilai
 *       403:
 *         description: Akses ditolak (Bukan guru pemilik kelas)
 *       404:
 *         description: Submisi tidak ditemukan
 */
