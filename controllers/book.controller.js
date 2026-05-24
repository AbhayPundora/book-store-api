const booksTable = require("../models/book.model");
const authorsTable = require("../models/author.model");
const db = require("../db");
const { eq, sql } = require("drizzle-orm");

exports.getAllBooks = async function (req, res) {
  const search = req.query.search;

  if (search) {
    const books = await db
      .select()
      .from(booksTable)
      .where(
        sql`to_tsvector('english', ${booksTable.title}) @@ to_tsquery('english', ${search})`
      );
    return res.json(books);
  }
  const books = await db.select().from(booksTable);
  return res.json(books);
};

exports.getBookById = async function (req, res) {
  const id = req.params.id;

  const [book] = await db
    .select()
    .from(booksTable)
    .where((table) => eq(table.id, id))
    .leftJoin(authorsTable, eq(booksTable.authorId, authorsTable.id))
    .limit(1);
  console.log(book);

  if (!book) {
    return res.status(404).json({ error: `Book with id ${id} doesn't exist` });
  }
  return res.json(book);
};

exports.createBook = async function (req, res) {
  //   console.log(req.headers);
  console.log(req.body); //to read this we want a middleware in this case express.json() for 'content-type': 'application/json', otherwise => undefined
  const { title, description, authorId } = req.body;
  if (!title || title == "")
    return res.status(400).json({ error: "title is required" });

  const [result] = await db
    .insert(booksTable)
    .values({ title, description, authorId })
    .returning({ id: booksTable.id }); // when book is  created then return the id of that book

  if (!result) {
    return res
      .status(404)
      .json({ error: `Author with id ${authorId} doesn't exist` });
  }

  return res
    .status(201)
    .json({ message: "Book created successfully", id: result.id });
};

exports.deleteBook = async function (req, res) {
  const id = req.params.id;
  await db.delete(booksTable).where(eq(booksTable.id, id));
  return res.status(200).json({ message: "Book deleted successfully" });
};
