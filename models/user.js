const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String },
    password: { type: String },
    email: { type: String },
    address: { type: String },
    contact: { type: Number },
    zip_code: { type: String },
    doc: { data: Buffer, contentType: String }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
