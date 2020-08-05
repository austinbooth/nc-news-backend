exports.up = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Creating users table...");

  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").primary().unique().notNullable();
    usersTable.string("avatar_url");
    usersTable.string("name");
  });
};

exports.down = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Dropping users table...");
  return knex.schema.dropTable("users");
};
