const authorsTable = require("../models/author.model");
const booksTable = require("../models/book.model");
const db = require("../db");
const { eq } = require("drizzle-orm");

exports.getAllAuthors = async function (req, res) {
  const authors = await db.select().from(authorsTable);
  console.log(authors);
  return res.json(authors);
};

exports.getAuthorById = async function (req, res) {
  const id = req.params.id;
  try {
    const [author] = await db
      .select()
      .from(authorsTable)
      .where(eq(authorsTable.id, id))
      .limit(1);
    return res.json(author);
  } catch (error) {
    res.status(404).json({ error: `Author with id ${id} doesn't exist` });
  }
};

exports.getAuthorBooks = async function (req, res) {
  const books = await db
    .select()
    .from(booksTable)
    .where(eq(booksTable.authorId, req.params.id));
  res.status(200).json(books);
};

exports.createAuthor = async function (req, res) {
  const { first_name, last_name, email } = req.body;

  if (first_name == "")
    return res.status(400).json({ message: "provide a first name" });
  if (email == "") return res.status(400).json({ message: "provide an email" });

  const [result] = await db
    .insert(authorsTable)
    .values({
      first_name,
      last_name,
      email,
    })
    .returning({ id: authorsTable.id });
  res
    .status(201)
    .json({ message: "Author created successfully", id: result.id });
};

exports.deleteAuthor = async function (req, res) {
  const id = req.params.id;
  await db.delete(authorsTable).where(eq(authorsTable.id, id));
  return res.status(200).json({ message: "Author deleted successfully" });
};
