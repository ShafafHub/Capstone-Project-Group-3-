exports.up = function (knex) {
    return knex.schema.createTable('orders', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned();
        table.decimal('total_price', 10, 2);
        table.string('status').defaultTo('pending');
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('orders');
};