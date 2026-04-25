exports.up = function (knex) {
    return knex.schema.createTable('variants', (table) => {
        table.increments('id');
        table.integer('product_id').unsigned();
        table.string('name');
        table.decimal('price', 10, 2);
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('variants');
};