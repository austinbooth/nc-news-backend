exports.up = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Creating users table...");

  return knex.schema.createTable("users", (usersTable) => {
    const avatarDefault =
      "https://img.favpng.com/6/17/15/rubber-duck-cartoon-avatar-png-favpng-kKz7Lgv3zu0m8WdGXRWfg45hN.jpg";

    usersTable.string("username").primary().unique().notNullable();
    usersTable.string("avatar_url").notNullable().defaultTo(avatarDefault);
    usersTable.string("name").notNullable();
  });
};

exports.down = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Dropping users table...");
  return knex.schema.dropTable("users");
};
