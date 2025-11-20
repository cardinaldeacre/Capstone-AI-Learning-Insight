/**
 * @param { import("knex").Knex } knex
 * @awaits { Promise<void> }
 */
exports.up = async function(knex) {
	const existsModules = await knex.schema.hasTable('modules');
	if (!existsModules) {
		await knex.schema.createTable('modules', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('class_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('classes')
				.onDelete('CASCADE');
			table.string('title', 255).notNullable();
			table.text('content').notNullable();
			table.integer('order_number').notNullable();
			table.timestamps(true, true);
		});
	}

	const existsModulesProgress = await knex.schema.hasTable('modules_progress');
	if (!existsModulesProgress) {
		await knex.schema.createTable('modules_progress', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('module_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('modules')
				.onDelete('CASCADE');
			table
				.bigInteger('student_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE');
			table.timestamp('started_at').defaultTo(knex.fn.now());
			table.timestamp('completed_at').nullable();
			table.unique(['module_id', 'student_id']);
		});
	}

	const existsAssignment = await knex.schema.hasTable('class_assignment');
	if (!existsAssignment) {
		await knex.schema.createTable('class_assignment', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('class_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('classes')
				.onDelete('CASCADE');
			table.string('title', 255).notNullable();
			table.text('content').notNullable();
			table.integer('min_score');
			table.timestamps(true, true);
		});
	}

	const existsQuizzes = await knex.schema.hasTable('quizzes');
	if (!existsQuizzes) {
		await knex.schema.createTable('quizzes', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('module_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('modules')
				.onDelete('CASCADE');
			table.string('title', 255).notNullable();
			table.integer('timer').notNullable();
			table.integer('min_score').nullable();
			table.timestamps(true, true);
		});
	}

	const existsQuizQuestions = await knex.schema.hasTable('quiz_questions');
	if (!existsQuizQuestions) {
		await knex.schema.createTable('quiz_questions', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('quiz_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('quizzes')
				.onDelete('CASCADE');
			table.text('question_text', 255).notNullable();
			table.timestamps(true, true);
		});
	}

	const existsQuizOption = await knex.schema.hasTable('quiz_options');
	if (!existsQuizOption) {
		await knex.schema.createTable('quiz_options', table => {
			table.bigIncrements('id').primary(); // PK
			table
				.bigInteger('question_id')
				.notNullable()
				.unsigned()
				.references('id')
				.inTable('quiz_questions')
				.onDelete('CASCADE');
			table.text('option_text', 255).notNullable();
			table.boolean('is_correct').notNullable().defaultTo(false);
			table.timestamps(true, true);
		});
	}
};

/**
 * @param { import("knex").Knex } knex
 * @awaits { Promise<void> }
 */
exports.down = async function(knex) {
	await knex.schema
		.dropTableIfExists('quiz_options')
		.dropTableIfExists('quiz_questions')
		.dropTableIfExists('quizzes')
		.dropTableIfExists('class_assignment')
		.dropTableIfExists('modules_progress')
		.dropTableIfExists('modules');
};
