const {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  index,
} = require("drizzle-orm/pg-core");
const { sql } = require("drizzle-orm");
const authorsTable = require("./author.model");

const booksTable = pgTable(
  "books",
  {
    id: uuid().primaryKey().defaultRandom(), // generate random uuid for each book(uuid => very hard to conflict)
    title: varchar({ length: 100 }).notNull(),
    description: text(),
    authorId: uuid()
      .references(() => authorsTable.id)
      .notNull(),
  },
  (table) => ({
    searchIndexOnTitle: index("title_search_index").using(
      "gin",
      sql`to_tsvector('english', ${table.title})`
    ),
    // where i want to put the index (for quick search)
  })
);

module.exports = booksTable;
