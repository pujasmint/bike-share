const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/:username", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to visit users profile"
    });
  } else {
    User.findOne({ username: req.params.username })
      .then(user => {
        if (user !== null) {
          var img = new Buffer(user.doc.data).toString("base64");
          res.render("profile", {user, img}
          )}
      })
      .catch(() => {
        res.send("error");
      });
  }
});

module.exports = router;
