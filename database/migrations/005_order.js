// --- create orders & order_items tables ---
exports.up = async (knex) => {
  await knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users');
    table.float('total_price');
    table.string('status').defaultTo('pending');
    table.timestamps(true, true);
  });

  await knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').references('id').inTable('orders');
    table.integer('product_id').references('id').inTable('products');
    table.integer('quantity');
  });
};

// --- rollback: drop tables in correct order ---
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
};