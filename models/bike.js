const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const bikeSchema = new Schema({
  type: { type: String },
  condition: { type: String },
  availbility: { type: String },
  rentPerDay: { type: String },
  minRentalDay: { type: Number},
  location: { type: Number, type: String},
  Contact: { type: Number, required: true },
  description: {type: String},
  bike_image: {type: String},
  owner: { type : ObjectId, ref: 'users' },
  bookings: [{type: ObjectId, ref: "bookings"}]
});

const bike = mongoose.model("bikes", bikeSchema);

module.exports = bike;