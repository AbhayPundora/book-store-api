const express = require("express");
const router = express.Router();
const {
  getAllAuthors,
  getAuthorById,
  getAuthorBooks,
  createAuthor,
  deleteAuthor,
} = require("../controllers/authors.controller");

router.get("/", getAllAuthors);

router.get("/:id", getAuthorById);

router.get("/:id/books", getAuthorBooks); // get all books written by this author

router.post("/", createAuthor);

router.delete("/:id", deleteAuthor);

module.exports = router;
