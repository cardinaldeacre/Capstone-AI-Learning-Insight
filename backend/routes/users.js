/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [student, teacher, admin]
 *       example:
 *         id: 1
 *         name: Iqbal Maulana
 *         email: iqbal@example.com
 *         role: student
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Users & Auth
 *     description: Manajemen pengguna & autentikasi
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users & Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email atau password salah
 */

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Mendapatkan Access Token baru
 *     tags: [Users & Auth]
 *     responses:
 *       200:
 *         description: Token baru berhasil dibuat
 *       401:
 *         description: Refresh token tidak ditemukan
 *       403:
 *         description: Refresh token tidak valid
 */

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout pengguna
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mengambil semua user
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter role
 *     responses:
 *       200:
 *         description: List pengguna
 */

/**
 * @swagger
 * /users/student:
 *   post:
 *     summary: Registrasi siswa baru
 *     tags: [Users & Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       409:
 *         description: Email sudah terdaftar
 */

/**
 * @swagger
 * /users/teacher:
 *   post:
 *     summary: Registrasi mentor (Admin Only)
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Mentor berhasil dibuat
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Menghapus user (Admin Only)
 *     tags: [Users & Auth]
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
 *         description: User dihapus
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Mendapatkan profil user
 *     tags: [Users & Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update informasi user
 *     tags: [Users & Auth]
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 */
