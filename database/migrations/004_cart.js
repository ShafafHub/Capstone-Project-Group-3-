exports.up = function (knex) {
    return knex.schema.createTable('cart', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned();
        table.integer('product_id').unsigned();
        table.integer('quantity').defaultTo(1);
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('cart');
};