const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Bike = require("../models/bike");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 host: 'smtp.gmail.com',
    auth: {
       user: `${process.env.user}`,
       pass: `${process.env.password}`
    }
});



router.get("/create/:bikeId/", (req, res, next) => {
  if (!req.session.currentUser) {
    res.render("login", {
      errorMessage: "Login first to reserve bike"
    });
  } else {
    const bikeId = req.params.bikeId;
    Bike.findOne({ _id: bikeId }).then(bike => {
      const ownerId = bike.owner;
      const newBooking = {
        customer: ObjectId(req.session.currentUser._id),
        bike: ObjectId(bikeId),
        status: "PENDING",
        owner: ObjectId(ownerId)
      };
      console.log(newBooking);

      Booking.create(newBooking)
      .then((booking)=>{
        var mailOptions = {
            from: 'bikeshare.today',
            to: "puja.singh@mitsot.com",
            subject: `Booking ${booking.id} confirmed`,
            text: `You booked bike ${booking.bike} from ${booking.owner}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
      })
        .then(() => {
          res.redirect("/bike/my-bookings");
        })
        .catch(() => {
          res.send("error");
        });
    });
  }
});

router.get("/confirm/:bikeId/", (req, res, next) => {
  const bikeId = req.params.bikeId;
  Booking.findOneAndUpdate(
    { bike: bikeId },
    { startDate: new Date(), status: "BOOKED" },
    { upsert: true },
    function(err, doc) {
      if (err) return res.send(500, { error: err });
      return res.redirect("/bike/my-bikes");
    }
  );
});

router.get("/cancel/:bikeId/", (req, res, next) => {
  const bikeId = req.params.bikeId;
  Booking.findOneAndDelete({ bike: bikeId }, {}, function(err, doc) {
    if (err) return res.send(500, { error: err });
    return res.redirect("/bike/my-bikes");
  });
});

router.get("/finish/:bikeId/", (req, res, next) => {
  const bikeId = req.params.bikeId;
  Booking.findOne({ bike: bikeId })
    .populate("customer")
    .populate("bike")
    .populate("owner")
    .then(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date();
      const diffTime = Math.abs(startDate.getTime() - endDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalDays =
        diffDays > booking.bike.minRentalDay ? diffDays : booking.bike.minRentalDay;
      const totalMoney = `${totalDays * booking.bike.rentPerDay} Euros`;
      Booking.findOneAndDelete({ bike: bikeId }, {}, function(err, doc) {
        if (err) return res.send(500, { error: err });
        return res.render("checkout", { booking, totalMoney });
      });
    });
});



module.exports = router;
