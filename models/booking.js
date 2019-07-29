const mongoose = require("mongoose");
const Schema   = mongoose.Schema;


const bookingSchema = new Schema({
    reservation_date: { type: Number},
    bike: { type : ObjectId, ref: 'bikes' },
    customer: { type : ObjectId, ref: 'users' },
});

const booking = mongoose.model("bookings", bookingSchema);

module.exports = booking;

