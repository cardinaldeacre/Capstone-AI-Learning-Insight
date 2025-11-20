/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
	const existsUsers = await knex.schema.hasTable('users');
	if (!existsUsers) {
		await knex.schema.createTable('users', table => {
			table.bigIncrements('id').primary(); // PK
			table.string('email', 255).notNullable().unique();
			table.string('name', 255).notNullable();
			table.string('password', 255).notNullable();
			table.string('role', 50).notNullable();
			table.timestamps(true, true);
		});
	}

	const existsClasses = await knex.schema.hasTable('classes');
	if (!existsClasses) {
		await knex.schema.createTable('classes', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigint('teacher_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.string('title', 255).notNullable();
			table.text('description', 255).notNullable();
			table.timestamps(true, true);
		});
	}

	const existsEnrolment = await knex.schema.hasTable('class_enrolment');
	if (!existsEnrolment) {
		await knex.schema.createTable('class_enrolment', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('class_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('classes')
				.onDelete('CASCADE');
			table
				.bigInteger('student_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.timestamp('enrolled_at').defaultTo(knex.fn.now());
			table.unique(['class_id', 'student_id']);
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
	await knex.schema
		.dropTableIfExists('class_enrolment')
		.dropTableIfExists('classes')
		.dropTableIfExists('users');
};
