//Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require("express-handlebars")
var request = require('request');
var cheerio = require('cheerio');
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var htmlRouter = require("./controllers/html-routes.js");
var articleRouter = require("./controllers/article-routes.js");

// Initialize Express
var port = process.env.PORT || 3001;
var app = express();

//Middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Initialize Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routing
app.use("/", htmlRouter);
app.use("/", articleRouter);

// Make public a static dir
app.use(express.static('public'));

//Database configuration
mongoose.connect('mongodb://localhost/mongoosescraper');
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
  });
  
  // Once logged in to the db through mongoose, log a success message
  db.once("open", function() {
    console.log("Mongoose connection successful.");
  });
  
  // Listen on port 3000
  app.listen(port, function() {
    console.log("App running on port 3000!");
  });

//Server connection
app.listen(3000, function() {
    console.log('App running on port 3000!');
});
