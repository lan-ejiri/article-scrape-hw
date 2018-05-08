var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: { unique: true }
  },

  link: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  comments: [
    {
      comment: String,
      commenter: String
    }
  ],

  saved: {
    type: Boolean,
    default: false
  }
});

var article = mongoose.model("Article", articleSchema);

module.exports = article;
