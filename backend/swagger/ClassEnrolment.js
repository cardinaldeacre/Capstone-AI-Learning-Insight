/**
 * @swagger
 * tags:
 *   name: Class Enrolments
 *   description: Manajemen Pendaftaran Kelas (Siswa Join Kelas)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrolment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         class_id:
 *           type: integer
 *         student_id:
 *           type: integer
 *         enrolled_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         class_id: 10
 *         student_id: 5
 *         enrolled_at: "2023-11-20T10:00:00Z"
 *
 *     MyClass:
 *       type: object
 *       properties:
 *         class_id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         teacher_name:
 *           type: string
 *         enrolled_at:
 *           type: string
 *           format: date-time
 *
 *     ClassStudent:
 *       type: object
 *       properties:
 *         student_id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         enrolled_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/enrolments/my-classes:
 *   get:
 *     summary: Ambil daftar kelas yang diikuti saya (Student Dashboard)
 *     tags: [Class Enrolments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List kelas berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MyClass'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/enrolments/class-students/{classId}:
 *   get:
 *     summary: Lihat daftar siswa dalam satu kelas (Teacher/Admin)
 *     tags: [Class Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List siswa berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ClassStudent'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/enrolments/check/{classId}:
 *   get:
 *     summary: Cek status apakah saya sudah join kelas ini?
 *     description: Digunakan frontend untuk mengubah tombol "Join Class" menjadi "Go to Class".
 *     tags: [Class Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status enrollment dikembalikan (true/false)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enrolled:
 *                   type: boolean
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/enrolments/{classId}:
 *   post:
 *     summary: Daftar / Masuk Kelas (Enroll)
 *     tags: [Class Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Berhasil mendaftar kelas
 *       409:
 *         description: Anda sudah terdaftar di kelas ini
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/enrolments/{classId}:
 *   delete:
 *     summary: Keluar dari Kelas (Unenroll)
 *     tags: [Class Enrolments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Berhasil keluar dari kelas
 *       404:
 *         description: Anda tidak terdaftar di kelas ini
 *       500:
 *         description: Server error
 */
