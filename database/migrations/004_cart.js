export function up(knex) {
  return knex.schema.createTable('cart_items', (table) => {
    // 1. id
    table.increments('id').primary();

    // 2. user_id (foreign key → users.id)
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    // 3. product_id (foreign key → products.id)
    table
      .integer('product_id')
      .unsigned()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');

    // 4. quantity
    table.integer('quantity').defaultTo(1);

    // 5. color
    table.string('color');

    // 6. size
    table.string('size');

    // 7. description
    table.string('description');

    // 8. timestamps
    table.timestamps(true, true);
  });
}

export function down(knex) {
  return knex.schema.dropTable('cart_items');
}