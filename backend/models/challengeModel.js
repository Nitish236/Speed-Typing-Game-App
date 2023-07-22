const mongoose = require("mongoose");

// Challenge Schema

const challengeSchema = new mongoose.Schema({
  text: { type: String, required: true },
  difficulty: { type: String, required: true },
});

// Challenge Model

module.exports = mongoose.model("Challenge", challengeSchema);
