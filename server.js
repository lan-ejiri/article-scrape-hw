//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//model
var db = require("./models");

//port and routing
var PORT = 8080; //put process env stuff

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//database
mongoose.connect("mongodb://localhost/articlescraperhwdb");

//handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//-----------------------------------
// start routes
//======================================

//main page
app.get("/", function(req, res) {
  res.render("index");
});

//route for scraping, just a button that re-directs to /articles
app.get("/scrape", function(req, res) {
  //html request
  axios.get("http://www.kotaku.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    //scraping every article
    $("article").each(function(i, element) {
      var result = {};

      result.title = $(this)
        .children("header")
        .children("h1")
        .children("a.js_entry-link")
        .text();
      result.link = $(this)
        .children("header")
        .children("h1")
        .children("a.js_entry-link")
        .attr("href");
      result.summary = $(this)
        .children("div.item__content")
        .children("div.entry-summary")
        .children("p")
        .text();

      // creating article document into collection
      db.article
        .create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

    //redirect to articles after successful scrape
    res.redirect("/articles");
  });
});

// show all articles in databse
app.get("/articles", function(req, res) {

  db.article
    .find({})
    .then(function(dbArticle) {
      res.render("articles", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.article
    .findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("Comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client \

      res.render("comments", { obj: dbArticle });
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.comments
    .create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.article.findOneAndUpdate(
        { _id: req.params.id },
        { comments: dbComment._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
