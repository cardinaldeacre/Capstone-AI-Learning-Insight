/**
 * @param { import("knex").Knex } knex
 * @awaits { Promise<void> }
 */
exports.up = async function(knex) {
	const existsQuizAttempt = await knex.schema.hasTable('quiz_attempts');
	if (!existsQuizAttempt) {
		await knex.schema.createTable('quiz_attempts', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('quiz_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('quizzes')
				.onDelete('CASCADE');
			table
				.bigInteger('student_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.double('score');
		});
	}

	const existssubmission = await knex.schema.hasTable('class_submission');
	if (!existssubmission) {
		await knex.schema.createTable('class_submission', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('assignment_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('class_assignment')
				.onDelete('CASCADE');
			table
				.bigInteger('student_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.timestamp('started_at').defaultTo(knex.fn.now());
			table.timestamp('submitted_at').nullable();
			table.integer('duration').nullable();
			table.text('feedback').nullable();
			table
				.enum('status', ['not_started', 'in_progress', 'submitted', 'graded'])
				.notNullable()
				.defaultTo('not_started');
			table.double('score');
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @awaits { Promise<void> }
 */
exports.down = async function(knex) {
	await knex.schema.dropTableIfExists('class_submission').dropTableIfExists('quiz_attempts');
};
