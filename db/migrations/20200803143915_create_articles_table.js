exports.up = function (knex) {
  if (process.env.NODE_ENV !== "test")
    console.log("Creating articles table...");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").notNullable();
    articlesTable.string("title").notNullable();
    articlesTable.text("body");
    articlesTable.integer("votes").defaultTo(0);
    articlesTable.string("topic").references("topics.slug").notNullable();
    articlesTable.string("author").references("users.username").notNullable();
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  if (process.env.NODE_ENV !== "test")
    console.log("Dropping articles table...");
  return knex.schema.dropTable("articles");
};
