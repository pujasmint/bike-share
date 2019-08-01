const express = require("express");
const router = express.Router();
const Bike = require("../models/bike");
const Booking = require("../models/booking");
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
  Booking.find({})
    .populate("bike")
    .then(bookings => {
      Bike.find({}).then(bikes => {
        const allBikes = bikes.map(bike => {
          const bb = bookings.find(book => {
            return book.bike._id.toString() == bike._id.toString();
          });
          const imgPath = new Buffer(bike.image.data).toString("base64");
          let status = bb ? bb.status : "AVAILABLE";
          let owner = "NOTOWNER";
          if (
            req.session.currentUser &&
            req.session.currentUser._id.toString() === bike.owner.toString()
          ) {
            owner = "OWNER";
          }
          return { bike, imgPath, owner, status: status };
        });

        res.render("bikeslist", {
          bikes: allBikes,
          listHeading: `Explore all bikes`
        });
      });
    });
});

router.post("/search", function(req, res, next) {
  Booking.find({})
    .populate("bike")
    .then(bookings => {
      Bike.find({ location: req.body.location }).then(bikes => {
        const allBikes = bikes.map(bike => {
          const bb = bookings.find(book => {
            return book.bike._id.toString() == bike._id.toString();
          });
          const imgPath = new Buffer(bike.image.data).toString("base64");
          let status = bb ? bb.status : "AVAILABLE";
          let owner = "NOTOWNER";
          if (
            req.session.currentUser &&
            req.session.currentUser._id.toString() === bike.owner.toString()
          ) {
            owner = "OWNER";
          }
          return { bike, imgPath, owner, status: status };
        });

        res.render("bikeslist", {
          bikes: allBikes,
          listHeading: `Explore all bikes in ${req.body.location} region`
        });
      });
    });
});

router.get("/details/:bikeid", function(req, res, next) {
  console.log('Here Out')
  Booking.find({})
    .populate("bike")
    .then(bookings => {
      console.log('Here', req.params.bikeid)
      Bike.findOne({ _id: req.params.bikeid }).then(bike => {
        const bb = bookings.find(book => {
          return book.bike._id.toString() == bike._id.toString();
        });
        const imgPath = new Buffer(bike.image.data).toString("base64");
        let status = bb ? bb.status : "AVAILABLE";
        let customer = bb ? bb.customer : null;
        let owner = "NOTOWNER";
        if (
          req.session.currentUser &&
          req.session.currentUser._id.toString() === bike.owner.toString()
        ) {
          owner = "OWNER";
        }
        console.log('Here', {
          bike,
          imgPath,
          status,
          owner,
          customer
        })
        res.render("bikedetails", {
          bike,
          imgPath,
          status,
          owner,
          customer
        });
      });
    });
});

router.get("/my-bikes", function(req, res, next) {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to see your listed bike"
    });
  } else {
    Booking.find({})
      .populate("bike")
      .then(bookings => {
        Bike.find({ owner: req.session.currentUser._id }).then(bikes => {
          const allBikes = bikes.map(bike => {
            const bb = bookings.find(book => {
              return book.bike._id.toString() == bike._id.toString();
            });
            const imgPath = new Buffer(bike.image.data).toString("base64");
            let status = bb ? bb.status : "AVAILABLE";
            let owner = "NOTOWNER";
            if (
              req.session.currentUser._id.toString() === bike.owner.toString()
            ) {
              owner = "OWNER";
            }
            return { bike, imgPath, owner, status: status };
          });

          res.render("bikeslist", {
            bikes: allBikes,
            listHeading: `My bikes`
          });
        });
      });
  }
});

router.get("/my-bookings", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to see your bookings"
    });
  } else {
    const customerId = req.session.currentUser._id;
    Booking.find({ customer: customerId })
      .populate("bike")
      .then(bookings => {
        const cutomerBikes = bookings.map(book => {
          const bike = book.bike;
          const imgPath = new Buffer(bike.image.data).toString("base64");
          let status = book.status;
          let owner = "NOTOWNER";
          if (
            req.session.currentUser._id.toString() === bike.owner.toString()
          ) {
            owner = "OWNER";
          }
          return { bike, imgPath, status, owner };
        });
        res.render("bikeslist", {
          bikes: cutomerBikes,
          listHeading: `My Bookings`
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
      res.redirect("/bike/my-bikes");
    })
    .catch(() => {
      res.send("error");
    });
});

module.exports = router;
