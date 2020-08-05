exports.up = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Creating topics table...");

  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").primary().notNullable();
    topicsTable.string("description");
  });
};

exports.down = function (knex) {
  if (process.env.NODE_ENV !== "test") console.log("Dropping topics table...");
  return knex.schema.dropTable("topics");
};
