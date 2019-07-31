var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  req.session.destroy(err => {
    // cannot access session here
    req.app.locals.layout = "layout"; //
    res.render("index", { message: "You are successfully logged out" });
  });
});

module.exports = router;
