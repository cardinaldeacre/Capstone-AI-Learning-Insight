const knex = require('../config/database'); // Sesuaikan path ini jika perlu

const ClassSubmissionService = {
    /**
     * Mendapatkan semua submisi untuk tugas tertentu (Dilihat oleh Teacher/Admin).
     * @param {number} assignmentId - ID Tugas.
     * @returns {Promise<Array<Object>>} Daftar submisi.
     */
    getAllByAssignment: async (assignmentId) => {
        return knex('class_submission')
            .where('assignment_id', assignmentId)
            .select(
                'class_submission.*',
                'users.name as student_name',
                'users.email as student_email'
            )
            .join('users', 'class_submission.student_id', 'users.id');
    },

    /**
     * Mendapatkan submisi tertentu oleh Student/Teacher/Admin.
     * @param {number} id - ID Submisi.
     * @returns {Promise<Object|null>} Submisi atau null.
     */
    getById: async (id) => {
        return knex('class_submission')
            .where('class_submission.id', id)
            .select(
                'class_submission.*',
                'users.name as student_name',
                'class_assignment.title as assignment_title',
                'class_assignment.class_id as class_id' // Penting untuk otorisasi
            )
            .join('users', 'class_submission.student_id', 'users.id')
            .join('class_assignment', 'class_submission.assignment_id', 'class_assignment.id')
            .first();
    },

    /**
     * Mendapatkan submisi siswa untuk tugas tertentu.
     * @param {number} assignmentId - ID Tugas.
     * @param {number} studentId - ID Siswa.
     * @returns {Promise<Object|null>} Submisi atau null.
     */
    getByAssignmentAndStudent: async (assignmentId, studentId) => {
        return knex('class_submission')
            .where({
                assignment_id: assignmentId,
                student_id: studentId
            })
            .first();
    },

    /**
     * Membuat submisi baru (dimulai).
     * @param {number} assignmentId - ID Tugas.
     * @param {number} studentId - ID Siswa.
     * @returns {Promise<Object>} Submisi yang baru dibuat.
     */
    create: async (assignmentId, studentId) => {
        // Cek duplikasi (agar 1 siswa hanya punya 1 entry per assignment)
        const existing = await ClassSubmissionService.getByAssignmentAndStudent(assignmentId, studentId);
        if (existing) {
             // Melemparkan error custom untuk ditangkap di Controller
            const error = new Error('Submission already exists for this student and assignment.');
            error.code = '409';
            throw error; 
        }

        const data = {
            assignment_id: assignmentId,
            student_id: studentId,
            status: 'submitted', // Langsung submit karena schema tidak ada field jawaban, hanya status dan waktu
            submitted_at: knex.fn.now(),
            score: 0.0 // Default score
        };

        const [newSubmission] = await knex('class_submission')
            .insert(data)
            .returning('*');
        return newSubmission;
    },

    /**
     * Memperbarui submisi (digunakan untuk grading/nilai).
     * @param {number} id - ID Submisi.
     * @param {Object} data - Data yang akan diupdate (score, feedback, status).
     * @returns {Promise<Object|null>} Submisi yang diperbarui atau null.
     */
    update: async (id, data) => {
        // data = { score?, feedback?, status? }
        const [updatedSubmission] = await knex('class_submission')
            .where('id', id)
            .update(data)
            .returning('*');

        return updatedSubmission;
    },

    /**
     * Menghapus submisi.
     * @param {number} id - ID Submisi.
     * @returns {Promise<number>} Jumlah baris yang dihapus (0 atau 1).
     */
    delete: async (id) => {
        return knex('class_submission').where('id', id).del();
    }
};

module.exports = ClassSubmissionService;