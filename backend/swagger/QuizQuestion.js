/**
 * @swagger
 * tags:
 * name: Quiz Questions
 * description: Manajemen Soal Kuis (Teks Pertanyaan)
 */

/**
 * @swagger
 * components:
 * schemas:
 * QuizQuestion:
 * type: object
 * properties:
 * id:
 * type: integer
 * quiz_id:
 * type: integer
 * question_text:
 * type: string
 * created_at:
 * type: string
 * format: date-time
 * updated_at:
 * type: string
 * format: date-time
 * example:
 * id: 10
 * quiz_id: 1
 * question_text: "Apa ibukota Indonesia?"
 *
 * QuizQuestionInput:
 * type: object
 * required:
 * - quiz_id
 * - question_text
 * properties:
 * quiz_id:
 * type: integer
 * question_text:
 * type: string
 * example: "Siapakah penemu lampu pijar?"
 */

/**
 * @swagger
 * /api/quiz-questions/quiz/{quizId}:
 * get:
 * summary: Ambil semua pertanyaan dalam kuis tertentu
 * tags: [Quiz Questions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: quizId
 * required: true
 * schema:
 * type: integer
 * description: ID Kuis
 * responses:
 * 200:
 * description: Data pertanyaan berhasil diambil
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/QuizQuestion'
 * 500:
 * description: Server error
 */

/**
 * @swagger
 * /api/quiz-questions/{id}:
 * get:
 * summary: Ambil detail satu pertanyaan
 * tags: [Quiz Questions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: ID Pertanyaan
 * responses:
 * 200:
 * description: Pertanyaan ditemukan
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * data:
 * $ref: '#/components/schemas/QuizQuestion'
 * 404:
 * description: Pertanyaan tidak ditemukan
 * 500:
 * description: Server error
 */

/**
 * @swagger
 * /api/quiz-questions:
 * post:
 * summary: Tambah pertanyaan baru (Teacher/Admin)
 * tags: [Quiz Questions]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/QuizQuestionInput'
 * responses:
 * 201:
 * description: Pertanyaan berhasil ditambahkan
 * 400:
 * description: Data tidak lengkap
 * 403:
 * description: Akses ditolak
 */

/**
 * @swagger
 * /api/quiz-questions/{id}:
 * put:
 * summary: Update teks pertanyaan (Teacher/Admin)
 * tags: [Quiz Questions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * question_text:
 * type: string
 * responses:
 * 200:
 * description: Pertanyaan berhasil diperbarui
 * 404:
 * description: Pertanyaan tidak ditemukan
 */

/**
 * @swagger
 * /api/quiz-questions/{id}:
 * delete:
 * summary: Hapus pertanyaan (Teacher/Admin)
 * tags: [Quiz Questions]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Pertanyaan berhasil dihapus
 * 404:
 * description: Pertanyaan tidak ditemukan
 */
