exports.up = function (knex) {
    return knex.schema.createTable("users", function (table) {
        // 1. id
        table.increments("id").primary();

        // 2. email
        table.string("email").notNullable().unique();

        // 3. password
        table.string("password").notNullable();

        // 4. role
        table.string("role").defaultTo("user");

        // 5. timestamps
        table.timestamps(true, true);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable("users");
};