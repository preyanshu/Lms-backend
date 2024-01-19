const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  borrowedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  priceHistory: { type: Array, required: false, default: [] },
  quantityHistory: { type: Array, required: false, default: [] },
});

module.exports = mongoose.model("Book", bookSchema);
