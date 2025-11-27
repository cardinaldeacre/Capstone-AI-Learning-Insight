/**
 * @swagger
 * tags:
 *   name: Module Progress
 *   description: Tracking progress belajar siswa
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ModuleProgress:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         student_id:
 *           type: integer
 *         module_id:
 *           type: integer
 *         started_at:
 *           type: string
 *           format: date-time
 *         completed_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *       example:
 *         id: 1
 *         student_id: 5
 *         module_id: 10
 *         started_at: "2023-11-20T10:00:00Z"
 *         completed_at: null
 */

/**
 * @swagger
 * /api/progress/class/{classId}:
 *   get:
 *     summary: Ambil progress belajar siswa di kelas tertentu
 *     tags: [Module Progress]
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
 *         description: Data progress berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     completed:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ModuleProgress'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/progress/{moduleId}/start:
 *   post:
 *     summary: Tandai modul dimulai (Start)
 *     description: Dipanggil saat siswa pertama kali membuka materi.
 *     tags: [Module Progress]
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
 *         description: Modul berhasil dimulai
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/progress/{moduleId}/complete:
 *   put:
 *     summary: Tandai modul selesai (Complete)
 *     description: Dipanggil saat siswa menyelesaikan materi/video.
 *     tags: [Module Progress]
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
 *         description: Modul berhasil ditandai selesai
 *       404:
 *         description: Progress tidak ditemukan (Belum di-start)
 *       500:
 *         description: Server error
 */
