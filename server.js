//dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

//model
var db = require("./models");

//port and routing
var PORT = process.env.PORT || 8080; //put process env stuff

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//database
var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/articlescraperhwdb";
mongoose.Promise;
mongoose.connect(MONGODB_URI);

//handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//static
app.use(express.static("public"));

//-----------------------------------
// start routes
//======================================

//main page
app.get("/", function(req, res) {
  res.render("index");
});
//[[works, just shows navbar and scarpe button]]

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
//[[works, figure out how to not scrape duplicates]]

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
//[[works, shows all articles]]

app.get("/articles/:id", function(req, res) {
  db.article
    .findOne({ _id: req.params.id })
    .then(function(dbArticle) {
      res.render("comments", { obj: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  var beh = req.body;
  db.article
    .update(
      { _id: req.params.id },
      {
        $push: { comments: { comment: beh.comment, commenter: beh.commenter } }
      }
    )
    .then(function(result) {
      res.redirect(req.get("referer"));
    })
    .catch(function(err) {
      res.json(err);
    });
});

// shows all favorites
app.get("/favorites", function(req, res) {
  db.article
    .find({ saved: "true" })
    .then(function(dbArticle) {
      res.render("favorites", { article: dbArticle });
    })
    .catch(function(err) {
      res.json(err);
    });
});
//[[works]]

app.get("/favorites/:id", function(req, res) {
  db.article
    .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: "true" } })
    .then(function(dbArticle) {
      res.redirect("/favorites");
    })
    .catch(function(err) {
      res.json(err);
    });
}); //[[works]]

app.get("/unfavorite/:id", function(req, res) {
  db.article
    .findOneAndUpdate({ _id: req.params.id }, { $set: { saved: "false" } })
    .then(function(dbArticle) {
      res.redirect("/favorites");
    })
    .catch(function(err) {
      res.json(err);
    });
}); //[[works]]

// listening
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
