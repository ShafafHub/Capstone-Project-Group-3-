exports.up = async function (knex) {
  // --- Check if column exists before adding ---
  const hasColumn = await knex.schema.hasColumn('categories', 'is_visible');
  if (!hasColumn) {
    await knex.schema.alterTable('categories', (table) => {
      table.boolean('is_visible').notNullable().defaultTo(true);
    });
  }

  // --- Update existing rows with default value ---
  await knex('categories').update({
    is_visible: knex.raw('COALESCE(is_visible, ?)', [1])
  });
};

exports.down = async function (knex) {
  // --- Drop column if it exists ---
  const hasColumn = await knex.schema.hasColumn('categories', 'is_visible');
  if (hasColumn) {
    await knex.schema.alterTable('categories', (table) => {
      table.dropColumn('is_visible');
    });
  }
};