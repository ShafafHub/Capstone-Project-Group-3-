// --- create products table ---
exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.text('description');
    table.float('price');
    table.string('image');
    table.string('category');
    table.string('color');
    table.string('tags');
    table.boolean('is_new').defaultTo(false);
    table.boolean('in_stock').defaultTo(false);
    table.string('size');
    table.integer('rating').defaultTo(0);
    table.timestamps(true, true);
  });
};

// --- rollback: drop products table ---
exports.down = function (knex) {
  return knex.schema.dropTable('products');
};