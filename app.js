const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const bookRoutes = require("./Routes/bookRoutes");
const userRoutes = require("./Routes/userRoutes");
const app = express();

dotenv.config();
app.use(cors());

// Connect to the database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  return res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  return res.status(500).json({ error: "Unknown server error" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
