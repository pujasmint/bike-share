var express = require('express');
var router = express.Router();
var User = require("../models/user");
var bcrypt = require('bcrypt');

/* GET users listing with user sign up */
router.get('/users', function(req, res, next) {
  res.render('users');
});

router.post('/users', function(req, res, next) {
  let newUser = {
    username: req.body.username, 
    password: req.body.password,
    email: req.body.email,
    address: req.body.address,
    contact: req.body.contact,
    zip_code: req.body.zip_code
  }
  User.create(newUser)
    .then((user)=> {
      res.redirect('/login');
    })
    .catch(()=> {
      res.send("error");
    })
});

// login page

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  let theUsername = req.body.username;
  let thePassword = req.body.password;
  if (theUsername === "" || thePassword === "") {
    res.render("login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
}

User.findOne({ "username": theUsername })
  .then(user => {
      if (user !== null) {
        res.render("users", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/users");
      } else {
        res.render("login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});



module.exports = router;

