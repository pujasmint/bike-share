const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs");

const saltRounds = 10;

/* GET users listing with user sign up */
router.get("/", function(req, res, next) {
  res.render("signup", {
    errorMessage: null
  });
});

router.post("/", function(req, res, next) {
  User.findOne({
    $or: [
      { email: req.body.email },
      { username: req.body.username },
      { contact: req.body.contact }
    ]
  }).exec(function(err, user) {
    if (user) {
      res.render("signup", {
        errorMessage: "Username, email or contact already exist"
      });
    } else {
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(req.body.password, salt);
      let newUser = {
        username: req.body.username,
        password: hashPass,
        email: req.body.email,
        address: req.body.address,
        contact: req.body.contact,
        zip_code: req.body.zip_code,
        doc: { data: fs.readFileSync(req.file.path), contentType: "image/png" }
      };
      User.create(newUser)
        .then(user => {
          res.redirect("/login");
        })
        .catch(() => {
          res.send("error");
        });
    }
  });
});

module.exports = router;
