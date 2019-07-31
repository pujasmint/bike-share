const express = require("express");
const router = express.Router();
const Bike = require("../models/bike");
const fs = require("fs");

router.get("/", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to list bike"
    });
  } else {
    res.render("createbike");
  }
});

router.get("/list", function(req, res, next) {
  Bike.find({ }).then(bikes => {
    const allBikes = bikes.map(bike => {
      const imgPath = new Buffer(bike.image.data).toString("base64");
      return { bike, imgPath };
    });
    res.render("bikeslist", {
      bikes: allBikes,
      listHeading: `Explore all bikes`
    });
  });
});

router.post("/search", function(req, res, next) {
  Bike.find({ location: req.body.location }).then(bikes => {
    const allBikes = bikes.map(bike => {
      const imgPath = new Buffer(bike.image.data).toString("base64");
      return { bike, imgPath };
    });
    res.render("bikeslist", {
      bikes: allBikes,
      listHeading: `Explore all bikes in ${req.body.location} region`
    });
  });
});

router.get("/details/:bikeid", function(req, res, next) {
  Bike.findOne({ _id: req.params.bikeid }).then(bike => {
    const imgPath = new Buffer(bike.image.data).toString("base64");
    res.render("bikedetails", {
      bike,
      imgPath
    });
  });
});

router.get("/my-bikes", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to see your listed bike"
    });
  } else {
    Bike.find({ owner: req.session.currentUser._id }).then(bikes => {
      const allBikes = bikes.map(bike => {
        const imgPath = new Buffer(bike.image.data).toString("base64");
        return { bike, imgPath };
      });
      res.render("bikeslist", {
        bikes: allBikes,
        listHeading: `My listed bikes`
      });
    });
  }
});

router.post("/", function(req, res, next) {
  let newBike = {
    type: req.body.type,
    condition: req.body.condition,
    availability: req.body.availability,
    rentPerDay: req.body.rentPerDay,
    minRentalDay: req.body.minRentalDay,
    location: req.body.location,
    description: req.body.description,
    image: { data: fs.readFileSync(req.file.path), contentType: "image/png" },
    owner: req.session.currentUser._id
  };
  Bike.create(newBike)
    .then(bike => {
      res.redirect("/my-bikes");
    })
    .catch(() => {
      res.send("error");
    });
});

module.exports = router;
