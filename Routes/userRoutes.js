const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


router.get("/", protect,userController.getAllUsers);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);
router.get("/profile", protect, userController.getUserProfile);
router.post("/borrow", protect, userController.borrowBook);
router.post("/return", protect, userController.returnBook);
router.get("/borrowed-books", protect, userController.getBorrowedBooks);


module.exports = router;
