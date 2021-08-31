const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = mongoose.model("User", {
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = {
  User,
};

// const userSchema = new Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   email: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   age: {
//     type: Number,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
// });

// const ModelClass = mongoose.model("User", userSchema);

// module.exports = ModelClass;
