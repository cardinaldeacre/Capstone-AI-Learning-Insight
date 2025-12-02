const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
	await knex('class_submission').del();
	await knex('modules_progress').del();
	await knex('class_enrolment').del();
	await knex('modules').del();
	await knex('classes').del();
	await knex('users').del();

	console.log('🧹 Database cleaned.');

	const salt = await bcrypt.genSalt(10);
	const password = await bcrypt.hash('bismillah', salt);

	const [admin] = await knex('users').insert({
		name: 'Super Admin',
		email: 'admin@asta.com',
		password: password,
		role: 'admin'
	}).returning('id');

	const [teacher] = await knex('users').insert({
		name: 'Oddy Virgantara',
		email: 'oddy@asta.com',
		password: password,
		role: 'teacher'
	}).returning('id');

	const [student] = await knex('users').insert({
		name: 'Iqbal Maulana',
		email: 'maul@asta.com',
		password: password,
		role: 'student'
	}).returning('id');

	console.log('👤 Users created.');

	const [reactClass] = await knex('classes').insert({
		teacher_id: teacher.id,
		title: 'Mastering React.js Frontend',
		description: 'Pelajari React dari dasar hingga mahir, termasuk Hooks, Context, dan Redux.',
	}).returning('id');

	const [backendClass] = await knex('classes').insert({
		teacher_id: teacher.id,
		title: 'Backend API with Express & Knex',
		description: 'Membangun REST API yang scalable menggunakan Node.js, Express, dan PostgreSQL.',
	}).returning('id');

	console.log('📚 Classes created.');

	await knex('class_enrolment').insert([
		{
			class_id: reactClass.id,
			student_id: student.id
		},
		{
			class_id: backendClass.id,
			student_id: student.id
		}
	]);

	console.log('🎓 Enrolments created.');

	const [modul1] = await knex('modules').insert({
		class_id: reactClass.id,
		title: 'Pengenalan React & JSX',
		content: 'Konten belajar React...',
		order_number: 1
	}).returning('id');

	const [modul2] = await knex('modules').insert({
		class_id: reactClass.id,
		title: 'React Hooks Basic',
		content: 'Konten belajar Hooks...',
		order_number: 2
	}).returning('id');

	await knex('modules_progress').insert({
		module_id: modul1.id,
		student_id: student.id,
		started_at: knex.fn.now(),
		completed_at: knex.fn.now()
	});

	console.log('🚀 Modules & Progress dummy data created.');
};