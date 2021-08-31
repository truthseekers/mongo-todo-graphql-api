const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const Todo = mongoose.model("Todo", {
  userId: String,
  isComplete: Boolean,
  name: String,
});

module.exports = {
  Todo,
};
