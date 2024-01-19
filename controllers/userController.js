const User = require("../Models/user");
const Book = require("../Models/book");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../config/generateToken");

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

// User registration
exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Please Enter all the Fields" });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
      role: "user", // Set the default role (you can modify this as needed)
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Borrow a book
exports.borrowBook = async (req, res, next) => {
  try {
    const { bookIsbn, userId } = req.body;

    const book = await Book.findOne({ isbn: bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (book.borrowedBy.includes(userId)) {
      return res.status(400).json({ error: "You've already borrowed this book" });
    }

    if (book.borrowedBy.length === book.quantity) {
      return res.status(400).json({ error: "Book is not available" });
    }

    book.borrowedBy.push(userId);
    await book.save();

    return res.status(200).json({
      book: {
        ...book.toJSON(),
        availableQuantity: book.quantity - book.borrowedBy.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// Return a borrowed book
exports.returnBook = async (req, res, next) => {
  try {
    const { bookIsbn, userId } = req.body;

    const book = await Book.findOne({ isbn: bookIsbn });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!book.borrowedBy.includes(userId)) {
      return res.status(400).json({ error: "You need to borrow this book first!" });
    }

    book.borrowedBy = book.borrowedBy.filter((borrowedBy) => borrowedBy.toString() !== userId.toString());
    await book.save();

    return res.status(200).json({
      book: {
        ...book.toJSON(),
        availableQuantity: book.quantity - book.borrowedBy.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

// User login
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: "Invalid Email or Password" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a list of borrowed books by the user
exports.getBorrowedBooks = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const borrowedBooks = await Book.find({ borrowedBy: user._id });

    return res.status(200).json({ books: borrowedBooks });
  } catch (err) {
    next(err);
  }
};


// Get user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.password !== req.body.password) {
      return res.status(400).json({ error: "Invalid password" })
    }
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// User logout
exports.logoutUser = (req, res) => {
  req.session.destroy();
  return res.status(200).json({ success: true });
};

// Borrow a book
// exports.borrowBook = async (req, res, next) => {
//   try {
//     const { bookIsbn, userId } = req.body;

//     const book = await bookSchema.findOne({ isbn: bookIsbn });
//     if (!book) {
//       return res.status(404).json({ error: "Book not found" });
//     }

//     const user = await userSchema.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (book.borrowedBy.includes(user.id)) {
//       return res.status(400).json({ error: "You've already borrowed this book" });
//     }

//     if (book.borrowedBy.length === book.quantity) {
//       return res.status(400).json({ error: "Book is not available" });
//     }

//     book.borrowedBy.push(user.id);
//     await book.save();

//     return res.status(200).json({
//       book: {
//         ...book.toJSON(),
//         availableQuantity: book.quantity - book.borrowedBy.length,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// // Return a borrowed book
// exports.returnBook = async (req, res, next) => {
//   try {
//     const { bookIsbn, userId } = req.body;

//     const book = await bookSchema.findOne({ isbn: bookIsbn });
//     if (!book) {
//       return res.status(404).json({ error: "Book not found" });
//     }

//     const user = await userSchema.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (!book.borrowedBy.includes(user.id)) {
//       return res.status(400).json({ error: "You need to borrow this book first!" });
//     }

//     book.borrowedBy = book.borrowedBy.filter((borrowedBy) => borrowedBy.toString() !== user.id.toString());
//     await book.save();

//     return res.status(200).json({
//       book: {
//         ...book.toJSON(),
//         availableQuantity: book.quantity - book.borrowedBy.length,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };


// Get a list of borrowed books by the user
exports.getBorrowedBooks = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const borrowedBooks = await bookSchema.find({ borrowedBy: user._id });

    return res.status(200).json({ books: borrowedBooks });
  } catch (err) {
    next(err);
  }
};
