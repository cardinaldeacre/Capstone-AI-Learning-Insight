/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
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
 *         order_number:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         id: 1
 *         class_id: 10
 *         title: Pengenalan React JS
 *         content: React adalah library...
 *         order_number: 1
 *
 *     ModuleInput:
 *       type: object
 *       required:
 *         - class_id
 *         - title
 *         - content
 *         - order_number
 *       properties:
 *         class_id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         order_number:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   - name: Modules
 *     description: Manajemen materi pembelajaran
 */

/**
 * @swagger
 * /api/modules/class/{classId}:
 *   get:
 *     summary: Ambil semua modul dalam kelas
 *     tags: [Modules]
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
 *         description: List modul berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/course/{classId}:
 *   get:
 *     summary: Ambil Materi Lengkap (Modul + Status Quiz/Tugas)
 *     description: Mengambil daftar modul dalam kelas, lengkap dengan status pengerjaan Kuis dan Tugas (Assignment) untuk user yang sedang login.
 *     tags: [Modules]
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
 *         description: Data berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       order_number:
 *                         type: integer
 *                       quiz_info:
 *                         type: object
 *                         nullable: true
 *                         description: Data kuis jika ada
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           is_passed:
 *                             type: boolean
 *                             description: Apakah user sudah lulus kuis ini?
 *                           user_score:
 *                             type: number
 *                             nullable: true
 *                       assignment_info:
 *                         type: object
 *                         nullable: true
 *                         description: Data tugas jika ada
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                           min_score:
 *                             type: integer
 *                           user_score:
 *                             type: number
 *                             nullable: true
 *                           status:
 *                             type: string
 *                             enum: [not_started, submitted, graded]
 *                           is_passed:
 *                             type: boolean
 *                             description: Apakah tugas dianggap selesai/lulus?
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Ambil detail satu modul
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Modul
 *     responses:
 *       200:
 *         description: Detail modul ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Modul tidak ditemukan
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Buat modul baru (Teacher/Admin)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleInput'
 *     responses:
 *       201:
 *         description: Module berhasil dibuat
 *       400:
 *         description: Data input tidak lengkap
 *       403:
 *         description: Akses ditolak
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update modul (Teacher/Admin)
 *     tags: [Modules]
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
 *               order_number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Module berhasil diedit
 *       404:
 *         description: Module tidak ditemukan
 *       409:
 *         description: Module duplikat
 */

/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Hapus modul (Teacher/Admin)
 *     tags: [Modules]
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
 *         description: Module berhasil dihapus
 *       404:
 *         description: Module tidak ditemukan
 */
