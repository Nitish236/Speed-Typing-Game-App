const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB_URI;

const connectToDatabase = () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(DB_URI);
};

module.exports = connectToDatabase;
