exports.up = function (knex) {
  console.log("Creating users table...");

  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").primary().unique().notNullable();
    usersTable.string("avatar_url");
    usersTable.string("name");
  });
};

exports.down = function (knex) {
  console.log("Dropping users table...");
  return knex.schema.dropTable("users");
};
