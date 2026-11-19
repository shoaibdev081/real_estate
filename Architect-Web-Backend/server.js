require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Start server immediately so health checks and proxy never time out
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection with auto-retry
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("CRITICAL: MONGO_URI is missing in .env!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.log("Retrying database connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();
