const knex = require('../config/database');

const ClassesService = {
	getAll: async () => {
		return knex('classes')
			.join('users', 'classes.teacher_id', 'users.id')
			.select(
				'classes.id',
				'classes.title',
				'classes.description',
				'classes.teacher_id',
				'users.name as teacher_name',
				'classes.created_at',
				'classes.updated_at'
			)
			.orderBy('classes.title', 'asc');
	},

	getClassesByStudent: async (role, userId) => {
		let query = knex('classes')
			.join('users', 'classes.teacher_id', 'users.id')
			.select(
				'classes.id',
				'classes.title',
				'classes.description',
				'classes.teacher_id',
				'users.name as teacher_name',
				'classes.created_at',
				'classes.updated_at'
			);

		if (role === 'teacher') {
			query = query.where('classes.teacher_id', userId);
		} else if (role === 'student') {
			query = query
				.join('class_enrolment', 'classes.id', 'class_enrolment.class_id')
				.where('class_enrolment.student_id', userId);
		}
		return query.orderBy('classes.created_at', 'desc');
	},

	getById: async id => {
		return knex('classes')
			.join('users', 'classes.teacher_id', 'users.id')
			.select('classes.*', 'users.name as teacher_name')
			.where('classes.id', id)
			.first();
	},

	create: async data => {
		const [newClass] = await knex('classes')
			.insert(data)
			.returning(['id', 'title', 'description', 'teacher_id', 'created_at', 'updated_at']);
		return newClass;
	},

	update: async (id, data) => {
		const [updatedClass] = await knex('classes')
			.where('id', id)
			.update({
				...data,
				updated_at: knex.fn.now(),
			})
			.returning(['id', 'title', 'description', 'teacher_id', 'created_at', 'updated_at']);

		return updatedClass;
	},

	delete: async id => {
		return knex('classes').where('id', id).del();
	},
};

module.exports = ClassesService;
