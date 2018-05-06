var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var commentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },
  commenter: {
    type: String,
    required: true,
    trim: true,
    validate: [
      function(input) {
        return input.length <= 20;
      },
      "Please choose a shorter name"
    ]
  }
});

var comment = mongoose.model("Comment", commentSchema);

module.exports = comment;
