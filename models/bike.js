const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const bikeSchema = new Schema({
  type: { type: String },
  condition: { type: String },
  availability: { type: String },
  rentPerDay: { type: String },
  minRentalDay: { type: Number },
  location: { type: Number, type: String },
  description: { type: String },
  image: { data: Buffer, contentType: String },
  owner: { type: ObjectId, ref: "users" }
});

const bike = mongoose.model("bikes", bikeSchema);

module.exports = bike;
