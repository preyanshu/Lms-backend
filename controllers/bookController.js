const Book = require("../Models/book");
const jwt = require("jsonwebtoken");
// Get all books
exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find({});
    const formattedBooks = books.map((book) => ({
      ...book.toJSON(),
      availableQuantity: book.quantity - book.borrowedBy.length,
    }));
    return res.status(200).json({ books: formattedBooks });
  } catch (err) {
    next(err);
  }
};

// Get a book by ISBN
exports.getBookByIsbn = async (req, res, next) => {
  try {
    const book = await Book.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const formattedBook = {
      ...book.toJSON(),
      availableQuantity: book.quantity - book.borrowedBy.length,
    };
    return res.status(200).json({ book: formattedBook });
  } catch (err) {
    next(err);
  }
};

// Create a new book
exports.createBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ isbn: req.body.isbn });
    if (book) {
      return res.status(400).json({ error: "Book with the same ISBN already exists" });
    }
    const newBook = await Book.create(req.body);
    return res.status(200).json({ book: newBook });
  } catch (err) {
    next(err);
  }
};

// Update a book by ISBN
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    const { _id, isbn, ...rest } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(book._id, rest, { new: true });
    return res.status(200).json({ book: updatedBook });
  } catch (err) {
    next(err);
  }
};

// Delete a book by ISBN
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findOne({ isbn: req.params.bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    await book.remove();
    return res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};