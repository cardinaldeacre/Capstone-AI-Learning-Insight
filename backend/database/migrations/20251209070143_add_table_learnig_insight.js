/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    const existsUsers = await knex.schema.hasTable('learning_insight');
    if (!existsUsers) {
        await knex.schema.createTable('learning_insight', table => {
            table.increments('id').primary();
            table.text('insight_text').notNullable();
            table.timestamps(true, true);
        });
    }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable('learning_insight');
};
