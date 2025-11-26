const knex = require('../config/database');

const ClassesService = {
    /**
     * Mendapatkan semua kelas, difilter berdasarkan role pengguna.
     * @param {string} role - Role pengguna (admin, teacher, student).
     * @param {number} userId - ID pengguna yang mengakses.
     * @returns {Promise<Array<Object>>} Daftar kelas.
     */
    getAll: async (role, userId) => {
        let query = knex('classes')
            .select(
                'classes.id',
                'classes.title',
                'classes.description',
                'classes.teacher_id',
                'users.name as teacher_name',
                'classes.created_at',
                'classes.updated_at'
            )
            .join('users', 'classes.teacher_id', 'users.id');

        // Admin: Lihat semua kelas
        if (role === 'admin') {
            // Tanpa filter tambahan
        } 
        // Teacher: Lihat kelas yang dia ajarkan
        else if (role === 'teacher') {
            query = query.where('classes.teacher_id', userId);
        }
        // Student: Lihat kelas yang dia enrol
        else if (role === 'student') {
            query = query
                .join('class_enrolment', 'classes.id', 'class_enrolment.class_id')
                .where('class_enrolment.student_id', userId);
        }

        return query;
    },

    /**
     * Mendapatkan kelas berdasarkan ID.
     * @param {number} id - ID kelas.
     * @returns {Promise<Object|null>} Kelas atau null.
     */
    getById: async (id) => {
        return knex('classes')
            .select('classes.*', 'users.name as teacher_name')
            .where('classes.id', id)
            .join('users', 'classes.teacher_id', 'users.id')
            .first();
    },

    /**
     * Membuat kelas baru.
     * @param {Object} data - Data kelas (title, description, teacher_id).
     * @returns {Promise<Object>} Kelas yang baru dibuat.
     */
    create: async (data) => {
        // data = { title, description, teacher_id }
        const [newClass] = await knex('classes')
            .insert(data)
            .returning(['id', 'title', 'description', 'teacher_id', 'created_at', 'updated_at']);
        return newClass;
    },

    /**
     * Memperbarui data kelas.
     * @param {number} id - ID kelas.
     * @param {Object} data - Data yang akan diupdate (misalnya title, description).
     * @returns {Promise<Object|null>} Kelas yang diperbarui atau null jika tidak ditemukan.
     */
    update: async (id, data) => {
        // data = { title?, description? }
        const [updatedClass] = await knex('classes')
            .where('id', id)
            .update(data)
            .returning(['id', 'title', 'description', 'teacher_id', 'created_at', 'updated_at']);

        return updatedClass;
    },

    /**
     * Menghapus kelas berdasarkan ID.
     * @param {number} id - ID kelas.
     * @returns {Promise<number>} Jumlah baris yang dihapus (0 atau 1).
     */
    delete: async (id) => {
        return knex('classes').where('id', id).del();
    },

    // --- Enrolment Logic (Ditambahkan ke ClassesService) ---

    /**
     * Mendaftarkan siswa ke kelas.
     * @param {number} classId - ID Kelas.
     * @param {number} studentId - ID Siswa.
     * @returns {Promise<Object>} Objek enrolment yang baru.
     */
    enrolStudent: async (classId, studentId) => {
        const data = {
            class_id: classId,
            student_id: studentId
        };
        // Jika sudah ada (unique constraint), ini akan melempar error '23505'
        const [enrolment] = await knex('class_enrolment')
            .insert(data)
            .returning('*');
        
        return enrolment;
    }
};

module.exports = ClassesService;