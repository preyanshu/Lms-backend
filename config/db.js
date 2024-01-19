const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connected.connection.host}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process on database connection failure
  }
};

module.exports = connectDB;
