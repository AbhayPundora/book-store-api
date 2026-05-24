const {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
} = require("drizzle-orm/pg-core");

const authorsTable = pgTable("authors", {
  id: uuid().primaryKey().defaultRandom(),
  first_name: varchar({ length: 55 }).notNull(),
  last_name: varchar({ length: 55 }),
  email: varchar({ length: 255 }).notNull().unique(),
});

module.exports = authorsTable;
