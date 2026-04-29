exports.up = function(knex) {
  return knex.schema.createTable('favorites', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.integer('product_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    // Each user can only favorite each product once
    table.unique(['user_id', 'product_id']);
    
    // Foreign keys (optional - if you have users and products tables)
    table.foreign('user_id').references('users.id').onDelete('CASCADE');
    table.foreign('product_id').references('products.id').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};