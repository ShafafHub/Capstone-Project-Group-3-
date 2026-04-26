/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {

    // 1. id
    table.increments("id").primary();

    // 2. name
    table.string("name");

    // 3. description
    table.text("description");

    // 4. price
    table.float("price");

    // 5. image
    table.string("image");

    // 6. category
    table.string("category");

    // 7. is_new
    table.boolean("is_new").defaultTo(false);

    // 8. tags
    table.string("tags");

    // 9. size
    table.string("size");

    // 10. rating
    table.integer("rating");

    // 11. in_stock
    table.boolean("in_stock");

    // 12. color
    table.string("color");

    // 13. timestamps
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("products");
};