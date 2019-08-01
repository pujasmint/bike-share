const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new Schema({
  bike: { type: ObjectId, ref: "bikes" },
  customer: { type: ObjectId, ref: "users" },
  owner: { type: ObjectId, ref: "users" },
  status: { type: String },
  startDate: { type: Date },
  endDate: { type: Date }
});

const booking = mongoose.model("bookings", bookingSchema);

module.exports = booking;
