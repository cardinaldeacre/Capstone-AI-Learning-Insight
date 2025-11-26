const knex = require('../config/database'); // Sesuaikan path ini jika perlu

const ClassAssignmentService = {
    /**
     * Mendapatkan semua tugas untuk kelas tertentu.
     * @param {number} classId - ID Kelas.
     * @returns {Promise<Array<Object>>} Daftar tugas.
     */
    getAll: async (classId) => {
        return knex('class_assignment')
            .where('class_id', classId)
            .select('*');
    },

    /**
     * Mendapatkan tugas berdasarkan ID.
     * @param {number} id - ID Tugas.
     * @returns {Promise<Object|null>} Tugas atau null.
     */
    getById: async (id) => {
        return knex('class_assignment').where('id', id).first();
    },

    /**
     * Membuat tugas baru.
     * @param {Object} data - Data tugas (class_id, title, content, min_score).
     * @returns {Promise<Object>} Tugas yang baru dibuat.
     */
    create: async (data) => {
        // data = { class_id, title, content, min_score? }
        const [newAssignment] = await knex('class_assignment')
            .insert(data)
            .returning(['id', 'class_id', 'title', 'content', 'min_score', 'created_at', 'updated_at']);
        return newAssignment;
    },

    /**
     * Memperbarui data tugas.
     * @param {number} id - ID Tugas.
     * @param {Object} data - Data yang akan diupdate (title, content, min_score).
     * @returns {Promise<Object|null>} Tugas yang diperbarui atau null jika tidak ditemukan.
     */
    update: async (id, data) => {
        // data = { title?, content?, min_score? }
        const [updatedAssignment] = await knex('class_assignment')
            .where('id', id)
            .update(data)
            .returning(['id', 'class_id', 'title', 'content', 'min_score', 'created_at', 'updated_at']);

        return updatedAssignment;
    },

    /**
     * Menghapus tugas berdasarkan ID.
     * @param {number} id - ID Tugas.
     * @returns {Promise<number>} Jumlah baris yang dihapus (0 atau 1).
     */
    delete: async (id) => {
        return knex('class_assignment').where('id', id).del();
    },

    /**
     * Mendapatkan class_id dari suatu assignment. Berguna untuk otorisasi teacher.
     * @param {number} id - ID Tugas.
     * @returns {Promise<number|null>} class_id atau null.
     */
    getClassIdByAssignmentId: async (id) => {
        const assignment = await knex('class_assignment')
            .where('id', id)
            .select('class_id')
            .first();
        return assignment ? assignment.class_id : null;
    }
};

module.exports = ClassAssignmentService;