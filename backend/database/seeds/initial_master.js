const bcrypt = require('bcrypt');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
	await knex('users').del();

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash('bismillah', salt);

	// 3. Masukkan data Admin
	await knex('users').insert([
		{
			name: 'Super Admin',
			email: 'admin@asta.com',
			password: hashedPassword,
			role: 'admin',
			created_at: knex.fn.now(),
			updated_at: knex.fn.now(),
		},
		{
			name: 'Iqbal Maulana',
			email: 'maul@asta.com',
			password: await bcrypt.hash('bismillah', 10),
			role: 'student',
			created_at: knex.fn.now(),
			updated_at: knex.fn.now(),
		},
		{
			name: 'Oddy Virgantara',
			email: 'oddy@asta.com',
			password: await bcrypt.hash('bismillah', 10),
			role: 'teacher',
			created_at: knex.fn.now(),
			updated_at: knex.fn.now(),
		},
	]);
};
