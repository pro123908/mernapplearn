//Model file name start with captital and is singular
// Importing mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Defining Schema for users
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
    // required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Exporting the User model
module.exports = User = mongoose.model("users", userSchema);
