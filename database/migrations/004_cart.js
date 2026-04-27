exports.up = async (knex) => {
  return knex.schema.createTable('cart_items', (table) => {
    table.increments('id').primary()
    table.integer('user_id').references('id').inTable('users')
    table.integer('product_id').references('id').inTable('products')
    table.integer('quantity').defaultTo(1)
    table.string('color')
    table.string('size')
    table.timestamps(true, true)
  })
}

exports.down = (knex) => {
  return knex.schema.dropTable('cart_items')
}