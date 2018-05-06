var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  comments: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },

  saved: {
    type: Boolean,
    default: false
  }




});

var article = mongoose.model("Article", articleSchema);

module.exports = article;
