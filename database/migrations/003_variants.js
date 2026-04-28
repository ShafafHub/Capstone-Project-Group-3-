exports.up = function (knex) {
    return knex.schema.createTable('variants', function (table) {
        // id (primary key, auto-increment)
        table.increments('id').primary();

        // product_id (foreign key → products.id)
        table.integer('product_id').references('id').inTable('products');

        // name (string)
        table.string('name');

        // price (float)
        table.float('price');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('variants');
};