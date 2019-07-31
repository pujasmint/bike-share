const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to visit users profile"
    });
  } else {
    const username = req.session.currentUser.username;
    User.findOne({ username: username })
      .then(user => {
        if (user !== null) {
          var img = new Buffer(user.doc.data).toString("base64");
          res.render("profile", {
            user,
            img
          });
        }
      })
      .catch(() => {
        res.send("error");
      });
  }
});
router.get("/:username", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to visit users profile"
    });
  } else {
    User.findOne({
      $or: [{ _id: req.params.username }, { username: req.params.username }]
    }).exec(function(err, user) {
      if (user !== null) {
        var img = new Buffer(user.doc.data).toString("base64");
        res.render("profile", {
          user,
          img
        });
      } else {
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
