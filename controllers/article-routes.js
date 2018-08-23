var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Note.js");
var Article = require("../models/Article.js");
var router = express.Router();


// ============= ROUTES FOR HOME PAGE =============//

// Scrape data from website and save to mongodb
router.get("/scrape", function(req, res) {
  // Grab the body of the html with request
  request('http://www.reuters.com/news/archive/technologyNews?view=page', function(error, response, html) {
    var $ = cheerio.load(html);
    $('div.story-content').each(function(i, element) {

        var result = {};

        result.title = $(this).children('h3').text();
        result.summary = $(this).children('p').text();

        var entry = new Article(result);

        entry.save(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
            }
        });
    });
  });
res.send("Scrape Complete");
}); 



// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  Article.find({}, function(err, doc) {
    if (err) {
        console.log(err);
    } else {
        res.json(doc);
    }
  });
});

// Save an article
router.post("/article/:id", function(req, res) {
  var newNote = new Note(req.body);
  newNote.save(function(err, doc) {
      if (err) {
          console.log(err);
      } else {
          console.log(doc.body);
          res.send(doc);
          console.log(req.params.id);
          Article.findOneAndUpdate({
                  '_id': req.params.id
              }, {
                  'note': doc._id
              })
              .exec(function(err, doc) {
                  if (err) {
                      console.log(err);
                  }
              });
      }
  });
});


router.post('/notes', function(req, res) {
  console.log(req.body);
    Note.findOne({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                res.json(doc);
                console.log(doc);
            }
        });
});

router.post('/notes/delete', function(req, res) {
  console.log(req.body);
    Note.findOneAndRemove({
            '_id':req.body
        })
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            } else {
                console.log("Note Deleted");
            }
        });
});
// ============= ROUTES FOR SAVED ARTICLES PAGE =============//




module.exports = router;
