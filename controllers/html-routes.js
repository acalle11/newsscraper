var express = require("express");
var exphbs = require("express-handlebars");

var router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});


module.exports = router;