const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/", function(req, res, next) {
  res.render("login");
});

router.post("/", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({ username: username })
    .then(user => {
      if (user === null) {
        res.render("signup", {
          errorMessage: "Username / Email combination do not exist"
        });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          // Save the login in the session!
          req.session.currentUser = {username: user.username, _id:user._id };
          req.app.locals.layout = "layoutlo"; //
          res.redirect("/bike/list");
        } else {
          res.render("login", {
            errorMessage: "Username / Email combination do not exist"
          });
        }
      }
    })
    .catch(() => {
      res.send("error");
    });
});

module.exports = router;
