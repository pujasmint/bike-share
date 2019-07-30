var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Bike = require('../models/bike')
const fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('bikeDetails', {
    viewTitle: "Create Bike"
  });
});

router.post('/', (req, res) => {
    if(!req.body._id)
    insertRecord(req, res);
    else 
    updateRecord(req, res);
});

function insertRecord(req, res){
    var bike = new Bike();
    bike.type = req.body.type;
    bike.condition = req.body.condition;
    bike.availbility = req.body.availbility;
    bike.rentPerDay = req.body.rentPerDay;
    bike.minRentalDay = req.body.minRentalDay;
    bike.location = req.body.location;
    bike.contact = req.body.contact;
    bike.description = req.body.description;
    bike.doc = {data: fs.readFileSync(req.file.path), contentType: "image/png"};
    bike.user = ObjectId(req.session.currentUser._id);
    // bike.booking = ObjectId(req.body.booking);
    bike.save((err, doc) => {
        if(!err) {
            res.redirect('/profile');
        } else {
            console.log('error during insertion: ' + err)
        }
    })
}

function updateRecord(req, res) {
    Bike.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('profile'); }
        else {console.log('Error during record update : ' + err);
        }
    });
}


module.exports = router;
