const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

router.get("/", bookController.getBooks);
router.get("/:bookIsbn", bookController.getBookByIsbn);
router.post("/", bookController.createBook);
router.patch("/:bookIsbn", bookController.updateBook);
router.delete("/:bookIsbn", bookController.deleteBook);

module.exports = router;
