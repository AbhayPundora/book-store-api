const express = require("express");
require("dotenv/config");
const bookRouter = require("./routes/book.routes");
const authorRouter = require("./routes/author.route");
const { loggerMiddleware } = require("./middlewares/logger");

const app = express();

// Middlewares (Plugins)
app.use(express.json());
app.use(loggerMiddleware);

//Routes
app.use("/books", bookRouter); // any request('GET', 'POST') in /books will go to bookRoutes
app.use("/authors", authorRouter);

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
