const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const bikeSchema = new Schema({
  type: { type: String },
  condition: { type: String },
  availbility: { type: String },
  rentPerDay: { type: String },
  minRentalDay: { type: Number},
  location: { type: String},
  contact: { type: Number},
  description: {type: String},
  doc: { data: Buffer, contentType: String },
  user: { type : ObjectId, ref: 'users' },
  // booking: [{type: ObjectId, ref: "bookings"}]
});

const Bike = mongoose.model("bikes", bikeSchema);

module.exports = Bike;