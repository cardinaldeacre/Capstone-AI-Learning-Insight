/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Manajemen Kelas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         teacher_id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         teacher_id: 5
 *         title: Matematika Dasar X
 *         description: Kelas matematika untuk pemula
 *
 *     ClassInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           example: Biologi Dasar
 *         description:
 *           type: string
 *           example: Mempelajari makhluk hidup
 */

/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Ambil semua kelas (Sesuai Role)
 *     description: Teacher hanya melihat kelas miliknya, Student melihat kelas yang diikuti, Admin melihat semua.
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data kelas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Class'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Ambil detail satu kelas
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Kelas
 *     responses:
 *       200:
 *         description: Detail kelas ditemukan
 *       404:
 *         description: Kelas tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Buat kelas baru (Teacher/Admin)
 *     description: Teacher otomatis menjadi pemilik kelas. Admin bisa menugaskan guru lain dengan mengirim field teacher_id.
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               teacher_id:
 *                 type: integer
 *                 description: (Opsional) Hanya bisa digunakan oleh Admin untuk menunjuk guru lain.
 *     responses:
 *       201:
 *         description: Kelas berhasil dibuat
 *       400:
 *         description: Data tidak lengkap
 *       409:
 *         description: Judul kelas sudah digunakan
 */

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update data kelas (Teacher/Admin)
 *     tags: [Classes]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kelas berhasil diedit
 *       404:
 *         description: Kelas tidak ditemukan
 */

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Hapus kelas (Teacher/Admin)
 *     tags: [Classes]
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
 *         description: Kelas berhasil dihapus
 *       404:
 *         description: Kelas tidak ditemukan
 */
